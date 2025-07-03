/**
 * CalDAV authentication credentials
 */
export interface CalDAVCreds {
    /** CalDAV server URL (e.g., https://p55-caldav.icloud.com) */
    principal: string;
    /** Full email address */
    username: string;
    /** App-specific password or OAuth token */
    password: string;
}

/**
 * Extended CalDAV credentials with calendar URL
 */
export interface CalDAVCredsWithCalendar extends CalDAVCreds {
    /** Specific calendar URL for operations */
    calendarURL: string;
}

/**
 * Calendar collection information
 */
export interface Calendar {
    /** Human-readable calendar name */
    displayName: string;
    /** Full CalDAV URL for this calendar */
    url: string;
    /** Optional: Calendar color (if supported by server) */
    color?: string;
    /** Optional: Calendar description */
    description?: string;
    /** Optional: Calendar timezone */
    timezone?: string;
    /** Optional: Whether calendar is writable */
    readonly?: boolean;
}

/**
 * Busy/occupied time slot
 */
export interface BusyEvent {
    /** ISO 8601 start time */
    start: string;
    /** ISO 8601 end time */
    end: string;
    /** Event title/summary */
    title: string;
    /** Optional: Event description */
    description?: string;
    /** Optional: Event location */
    location?: string;
    /** Optional: Event status (CONFIRMED, TENTATIVE, CANCELLED) */
    status?: 'CONFIRMED' | 'TENTATIVE' | 'CANCELLED';
    /** Optional: Event transparency (OPAQUE, TRANSPARENT) */
    transparency?: 'OPAQUE' | 'TRANSPARENT';
    /** Optional: Source calendar URL */
    calendarURL?: string;
    /** Optional: Unique event identifier */
    uid?: string;
}

/**
 * Event creation details
 */
export interface EventDetails {
    /** ISO 8601 start time */
    start: string;
    /** ISO 8601 end time */
    end: string;
    /** Event title/summary */
    title: string;
    /** Optional: Event description */
    description?: string;
    /** Optional: Event location */
    location?: string;
    /** Optional: Attendee email address */
    attendee?: string;
    /** Optional: Additional attendee email addresses */
    attendees?: string[];
    /** Optional: Event status */
    status?: 'CONFIRMED' | 'TENTATIVE' | 'CANCELLED';
    /** Optional: Event transparency */
    transparency?: 'OPAQUE' | 'TRANSPARENT';
    /** Optional: Recurrence rule (RRULE) */
    recurrence?: string;
    /** Optional: Timezone identifier */
    timezone?: string;
}

/**
 * Result of booking/event creation
 */
export interface BookingResult {
    /** Whether the booking was successful */
    success: boolean;
    /** Generated event UID */
    uid: string;
    /** CalDAV URL of the created event */
    eventURL: string;
    /** Optional: Server response message */
    message?: string;
    /** Optional: HTTP status code */
    statusCode?: number;
    /** Optional: ETag for the created event */
    etag?: string;
}

/**
 * Free/busy query options
 */
export interface FreeBusyOptions {
    /** ISO 8601 start time for query */
    start: string;
    /** ISO 8601 end time for query */
    end: string;
    /** Optional: Include all-day events */
    includeAllDay?: boolean;
    /** Optional: Include tentative events */
    includeTentative?: boolean;
    /** Optional: Include cancelled events */
    includeCancelled?: boolean;
    /** Optional: Filter by calendar URLs */
    calendarURLs?: string[];
}

/**
 * Calendar discovery options
 */
export interface DiscoveryOptions {
    /** Optional: Include read-only calendars */
    includeReadOnly?: boolean;
    /** Optional: Include shared calendars */
    includeShared?: boolean;
    /** Optional: Maximum number of calendars to return */
    maxCalendars?: number;
    /** Optional: Timeout for discovery requests (ms) */
    timeout?: number;
}

/**
 * CalDAV server capabilities
 */
export interface ServerCapabilities {
    /** Supported CalDAV version */
    version: string;
    /** Whether server supports scheduling */
    scheduling: boolean;
    /** Whether server supports calendar-auto-schedule */
    autoSchedule: boolean;
    /** Supported calendar component types */
    supportedComponents: string[];
    /** Maximum resource size in bytes */
    maxResourceSize?: number;
    /** Supported calendar data formats */
    supportedFormats: string[];
}

/**
 * Error types for CalDAV operations
 */
export interface CalDAVError extends Error {
    /** HTTP status code */
    statusCode?: number;
    /** CalDAV server response */
    response?: string;
    /** Original request details */
    request?: {
        method: string;
        url: string;
        headers: Record<string, string>;
    };
}

/**
 * Progress callback for batch operations
 */
export type ProgressCallback = (completed: number, total: number, currentOperation: string) => void;

/**
 * Batch operation result
 */
export interface BatchResult<T> {
    /** Successfully processed items */
    success: T[];
    /** Failed items with errors */
    failed: Array<{
        item: T;
        error: CalDAVError;
    }>;
    /** Total number of items processed */
    total: number;
    /** Number of successful operations */
    successCount: number;
    /** Number of failed operations */
    failedCount: number;
}

/**
 * Time zone information
 */
export interface TimeZoneInfo {
    /** IANA timezone identifier */
    id: string;
    /** Timezone display name */
    displayName: string;
    /** UTC offset in minutes */
    utcOffset: number;
    /** Whether timezone observes daylight saving time */
    dst: boolean;
}

/**
 * Recurrence rule components
 */
export interface RecurrenceRule {
    /** Frequency (DAILY, WEEKLY, MONTHLY, YEARLY) */
    frequency: 'DAILY' | 'WEEKLY' | 'MONTHLY' | 'YEARLY';
    /** Interval between occurrences */
    interval?: number;
    /** Number of occurrences */
    count?: number;
    /** End date for recurrence */
    until?: string;
    /** Days of week (for WEEKLY frequency) */
    byWeekDay?: string[];
    /** Days of month (for MONTHLY frequency) */
    byMonthDay?: number[];
    /** Months of year (for YEARLY frequency) */
    byMonth?: number[];
}

export interface NewEventInput {
    start: string; // ISO, UTC (or local – caller’s job)
    end: string;
    title: string;
    attendee?: string; // optional
}
