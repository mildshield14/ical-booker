import fetch from 'node-fetch';

export interface CalDAVCreds {
    principal: string; // e.g. 'https://p55-caldav.icloud.com'
    username: string; // APPLE_ID
    password: string; // APPLE_APP_PASSWORD
}

export function basicAuth({ username, password }: CalDAVCreds): string {
    return `Basic ${Buffer.from(`${username}:${password}`).toString('base64')}`;
}

export async function propfind(url: string, body: string, creds: CalDAVCreds, depth: '0' | '1' = '0'): Promise<string> {
    const r = await fetch(url, {
        method: 'PROPFIND',
        headers: {
            Authorization: basicAuth(creds),
            'Content-Type': 'application/xml',
            Depth: depth,
        },
        body,
    });
    if (!r.ok) throw new Error(`${url} → ${r.status}`);
    return r.text();
}

export async function report(url: string, body: string, creds: CalDAVCreds): Promise<string> {
    const r = await fetch(url, {
        method: 'REPORT',
        headers: {
            Authorization: basicAuth(creds),
            Depth: '1',
            'Content-Type': 'application/xml',
        },
        body,
    });
    if (!r.ok) throw new Error(`${url} → ${r.status}`);
    return r.text();
}
