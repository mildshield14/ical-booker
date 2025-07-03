// src/lib/discover.ts
import fetch from 'node-fetch';
import type { CalDAVCreds, Calendar } from './types.js';

/* small helper to build PROPFIND requests */
const xmlReq = (
    auth: string,
    depth = '0',
): ((body?: string) => {
    method: string;
    headers: {
        Authorization: string;
        'Content-Type': string;
        Depth: string;
    };
    body: string;
}) => (body = '') => ({
    method: 'PROPFIND',
    headers: {
        Authorization: auth,
        'Content-Type': 'application/xml',
        Depth: depth,
    },
    body,
});
/**
 * Discover all writable calendar collections for the given CalDAV account.
 * Works with iCloud (partition hosts p01-p99), Google (once authenticated),
 * Fastmail, and most generic servers.
 */
export async function discoverCalendars({
    principal, // e.g. https://p55-caldav.icloud.com
    username, // full address
    password, // app-specific pwd
}: CalDAVCreds): Promise<Calendar[]> {
    /* ------------------------------------------------------------------ */
    /* ① find the principal URL (207 multistatus with <current-user-principal>) */
    /* ------------------------------------------------------------------ */
    const AUTH = `Basic ${Buffer.from(`${username}:${password}`).toString('base64')}`;
    const propfind = xmlReq(AUTH);

    const principalResp = await fetch(
        principal,
        propfind('<propfind xmlns="DAV:"><prop><current-user-principal/></prop></propfind>'),
    );
    const principalXML = await principalResp.text();
    console.debug('① status', principalResp.status, '\n', principalXML.slice(0, 400));

    const princHref = principalXML.match(/<current-user-principal[^>]*>\s*<href[^>]*>([^<]+)</i)?.[1];
    if (!princHref) throw new Error('Could not discover principal URL');

    /* ------------------------------------------------------------------ */
    /* ② locate calendar-home-set  ─ multiple fallbacks                   */
    /* ------------------------------------------------------------------ */
    let homeURL: string | undefined;

    // ②-a ask the server explicitly
    const homeResp = await fetch(
        new URL(princHref, principal).toString(),
        propfind('<propfind xmlns="DAV:"><prop><calendar-home-set/></prop></propfind>'),
    );
    const homeXML = await homeResp.text();
    console.debug('② status', homeResp.status, '\n', homeXML.slice(0, 400));

    const homeHref = homeXML.match(/<calendar-home-set[^>]*>\s*<href[^>]*>([^<]+)</i)?.[1];
    if (homeHref) {
        homeURL = new URL(homeHref, principal).toString();
    }

    // ②-b if missing, probe multiple iCloud patterns
    if (!homeURL) {
        // Extract user ID from principal URL (e.g., /18038309674/principal/ -> 18038309674)
        const userIdMatch = princHref.match(/\/(\d+)\/principal/);
        const userId = userIdMatch ? userIdMatch[1] : username.split('@')[0];

        const candidates = [
            // Standard CalDAV pattern
            new URL('./calendars/', new URL(princHref, principal)).toString(),
            // iCloud pattern with user ID from principal
            new URL(`/${userId}/calendars/`, principal).toString(),
            // iCloud pattern with email prefix (fallback)
            new URL(`/${username.split('@')[0]}/calendars/`, principal).toString(),
        ];

        console.log('🔍 Trying calendar-home-set fallback URLs:', candidates);

        for (const url of candidates) {
            try {
                // Depth **1** because iCloud forbids Depth 0 on this collection
                const r = await fetch(url, {
                    method: 'PROPFIND',
                    headers: {
                        Authorization: AUTH,
                        Depth: '1',
                        'Content-Type': 'application/xml',
                    },
                });
                console.log(`📍 Trying ${url}: ${r.status}`);
                if (r.status >= 200 && r.status < 300) {
                    homeURL = url.endsWith('/') ? url : `${url}/`;
                    console.log('✅ Found working calendar-home-set:', homeURL);
                    break;
                }
            } catch (error: unknown) {
                console.log(`❌ Failed to probe ${url}:`, error instanceof Error ? error.message : error);
            }
        }

        if (!homeURL) {
            throw new Error(`calendar-home-set not found on server. Tried: ${candidates.join(', ')}`);
        }
        console.log('⚠️  calendar-home-set missing; using fallback:', homeURL);
    }

    /* ------------------------------------------------------------------ */
    /* ③ list child collections (Depth:1)                                 */
    /* ------------------------------------------------------------------ */
    const listResp = await fetch(
        homeURL,
        xmlReq(
            AUTH,
            '1',
        )(
            `<propfind xmlns="DAV:" xmlns:C="urn:ietf:params:xml:ns:caldav">
         <prop><displayname/><resourcetype/></prop>
       </propfind>`,
        ),
    );

    const listXML = await listResp.text();
    console.debug('③ status', listResp.status, '\n', listXML.slice(0, 400));

    if (listResp.status < 200 || listResp.status >= 300) {
        throw new Error(`Failed to list calendars: ${listResp.status} ${listResp.statusText}`);
    }

    /* pull every <response><href>… and its <displayname> */
    const matches = listXML.matchAll(/<response[^>]*>[\s\S]*?<href[^>]*>([^<]+)<[\s\S]*?<displayname[^>]*>([^<]*)</gi);

    const calendars: Calendar[] = [];
    for (const [, href, name] of matches) {
        if (!name?.trim() || !href || !/\/[A-Fa-f0-9-]+\/$/.test(href)) continue; // skip root/inbox
        calendars.push({
            displayName: name.trim(),
            url: new URL(href, principal).toString(),
        });
    }

    console.log(
        `📅 Found ${calendars.length} calendars:`,
        calendars.map(c => c.displayName),
    );
    return calendars;
}
