// src/lib/busy.ts
import fetch from 'node-fetch';
import ical from 'node-ical';
import pkg from 'rrule';
const { RRule } = pkg;
import type { BusyEvent, CalDAVCreds, Calendar } from './types';

const fmt = (d: string | Date): string => `${new Date(d).toISOString().replace(/[-:]/g, '').split('.')[0]}Z`;

export async function getBusyEvents(
    creds: CalDAVCreds,
    calendars: Calendar[],
    startISO: string,
    endISO: string,
): Promise<BusyEvent[]> {
    const range = { start: fmt(startISO), end: fmt(endISO) };
    const AUTH = `Basic ${Buffer.from(`${creds.username}:${creds.password}`).toString('base64')}`;

    const report = `<?xml version="1.0"?>
  <C:calendar-query xmlns:C="urn:ietf:params:xml:ns:caldav" xmlns:D="DAV:">
    <D:prop><C:calendar-data><C:expand start="${range.start}" end="${range.end}"/></C:calendar-data></D:prop>
    <C:filter><C:comp-filter name="VCALENDAR"><C:comp-filter name="VEVENT">
      <C:time-range start="${range.start}" end="${range.end}"/>
    </C:comp-filter></C:comp-filter></C:filter>
  </C:calendar-query>`;

    // fetch every calendar in parallel
    const bodies = await Promise.all(
        calendars.map(({ url }) =>
            fetch(url, {
                method: 'REPORT',
                headers: { Authorization: AUTH, Depth: '1', 'Content-Type': 'application/xml' },
                body: report,
            }).then(r => (r.ok ? r.text() : '')),
        ),
    );

    const events: BusyEvent[] = [];
    for (const xml of bodies) {
        for (const [, ics] of xml.matchAll(
            /<calendar-data[^>]*>(?:<!\[CDATA\[)?([\s\S]*?)(?:\]\]>)?<\/calendar-data>/gi,
        )) {
            const parsed = ical.parseICS(ics as string);

            for (const ev of Object.values(parsed) as ical.VEvent[]) {
                if (!(ev && ev.type === 'VEVENT' && ev.start && ev.end)) continue;

                // one-off
                if (!ev.rrule) {
                    events.push({
                        start: ev.start.toISOString(),
                        end: ev.end.toISOString(),
                        title: ev.summary || '(no title)',
                    });
                    continue;
                }

                // recurring
                const rule = RRule.fromString(ev.rrule.toString());
                rule.between(new Date(startISO), new Date(endISO), true).forEach(dt => {
                    const duration = ev.end.getTime() - ev.start.getTime();
                    events.push({
                        start: dt.toISOString(),
                        end: new Date(dt.getTime() + duration).toISOString(),
                        title: ev.summary || '(no title)',
                    });
                });
            }
        }
    }

    return events.sort((a, b) => a.start.localeCompare(b.start));
}
