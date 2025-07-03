import fetch from 'node-fetch';
import type { EmailConfig, NewEventInput } from './types.js';

/**
 * Send booking confirmations (guest + admin) via EmailJS.
 */
export async function sendBookingEmails(
    cfg: EmailConfig,
    ev: NewEventInput & { url: string; uid: string },
): Promise<void> {
    const templateParams = {
        event_title: ev.title,
        event_start: format(ev.start),
        event_end: format(ev.end),
        attendee_name:
            typeof ev.attendee === 'string'
                ? ev.attendee.split('@')[0] || 'Guest'
                : 'Guest',
        attendee_email: typeof ev.attendee === 'string' ? ev.attendee : 'N/A',
        meeting_reason:
            'description' in ev && typeof ev.description === 'string'
                ? ev.description
                : '',
        ics_url: ev.url,
        uid: ev.uid,
        from_name: cfg.fromName ?? '',
        from_email: cfg.fromEmail ?? '',
    };

    // 1) confirmation to guest (if address supplied)
    if (ev.attendee) {
        await callEmailJs(cfg, {
            ...templateParams,
            to_email: ev.attendee,
            to_name: templateParams.attendee_name,
        });
        await callEmailJs(cfg, {
            ...templateParams,
            to_email: cfg.adminEmail ?? '',
            to_name: cfg.fromName ?? '',
        });
    }

    // 2) notification to admin
    await callEmailJs(cfg, {
        ...templateParams,
        to_email: cfg.adminEmail ?? '',
        to_name: cfg.fromName ?? '',
    });
}

function callEmailJs(
    cfg: EmailConfig,
    template_params: Record<string, unknown>,
): Promise<void> {
    return fetch('https://api.emailjs.com/api/v1.0/email/send', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'X-EmailJS-Key': cfg.privateKey ?? '',
            // allow caller to decide the CORS origin (defaults to '*')
            origin: cfg.origin ?? '*',
        },
        body: JSON.stringify({
            service_id: cfg.serviceId ?? '',
            template_id: cfg.templateId ?? '',
            user_id: cfg.publicKey ?? '',
            accessToken: cfg.privateKey ?? '',
            template_params,
        }),
    }).then(r => {
        if (!r.ok) throw new Error(`EmailJS error ${r.status}`);
    });
}

const format = (iso: string): string =>
    new Date(iso).toLocaleString('en-US', {
        timeZone: 'America/Toronto',
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        timeZoneName: 'short',
    });
