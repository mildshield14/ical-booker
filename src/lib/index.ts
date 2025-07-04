// src/lib/index.ts
export * from './types';
export { discoverCalendars } from './discover.js';
export { getBusyEvents } from './busy.js';
export { createBooking } from './book.js';
export { sendBookingEmails} from './email.js'

/**
 * @mildshield14/ical-booker
 *
 * A lightweight, modern CalDAV client for Node.js
 * Discover calendars, check availability, and create bookings
 *
 * @author mildshield14
 * @version 1.0.0
 * @license MIT
 */

// Type exports
export type {
    CalDAVCreds,
    CalDAVCredsWithCalendar,
    Calendar,
    BusyEvent,
    EventDetails,
    BookingResult,
    FreeBusyOptions,
    DiscoveryOptions,
    ServerCapabilities,
    CalDAVError,
    ProgressCallback,
    BatchResult,
    TimeZoneInfo,
    RecurrenceRule,
    EmailConfig,
    NewEventInput,
} from './types';

// Version information
export const VERSION = '1.0.0';

export const DEFAULT_CONFIG = {
    timeout: 30000,
    maxRetries: 3,
    userAgent: '@mildshield14/ical-booker/1.0.0',
} as const;
