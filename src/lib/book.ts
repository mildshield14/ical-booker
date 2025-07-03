import fetch from 'node-fetch';
import { createEvent } from 'ics';
import type { CalDAVCreds, NewEventInput } from './types.js';

export async function createBooking(
    creds: CalDAVCreds & { calendarURL: string }, // calendarURL = “…/UUID/”
    { start, end, title, attendee }: NewEventInput,
): Promise<{ uid: string; url: string }> {
    const icsValue: string = await new Promise((res, rej) => {
        createEvent(
            { start: toArr(start), end: toArr(end), title, attendees: attendee ? [{ email: attendee }] : [] },
            (err, val) => (err ? rej(err) : res(val)),
        );
    });

    const uid = `${Date.now()}-${Math.random().toString(36).slice(2)}.ics`;
    const url = creds.calendarURL.replace(/\/$/, '/') + uid;

    const ok = await fetch(url, {
        method: 'PUT',
        headers: {
            Authorization: `Basic ${Buffer.from(`${creds.username}:${creds.password}`).toString('base64')}`,
            'Content-Type': 'text/calendar; charset=utf-8',
        },
        body: icsValue,
    }).then(r => r.ok);

    if (!ok) throw new Error('PUT failed');
    return { uid, url };
}
// src/lib/book.ts  (replace toArr helper)

function toArr(iso: string): [number, number, number, number, number] {
    const d = new Date(iso);

    return [d.getUTCFullYear(), d.getUTCMonth() + 1, d.getUTCDate(), d.getUTCHours(), d.getUTCMinutes()] as [
        number,
        number,
        number,
        number,
        number,
    ]; // DateTime type
}
