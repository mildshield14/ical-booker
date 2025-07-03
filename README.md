# @mildshield14/ical-booker

A lightweight, modern CalDAV client for Node.js that makes it easy to discover calendars, check availability, and create bookings. Perfect for building scheduling applications, availability checkers, and calendar integrations.

## ✨ Features

- 🔍 **Auto-discovery**: Automatically discovers calendar collections from CalDAV servers
- 📅 **Multi-provider support**: Works with iCloud, Google Calendar, Fastmail, and other CalDAV servers
- ⚡ **Busy time checking**: Quickly fetch busy/free information for scheduling
- 📝 **Event creation**: Create calendar events with attendees
- 🔒 **Secure authentication**: Supports app-specific passwords and OAuth
- 🪶 **Lightweight**: Minimal dependencies, ESM-first design

## 🚀 Quick Start

```bash
npm install @mildshield14/ical-booker
```

### Basic Usage

```javascript
import { discoverCalendars, getBusyEvents, createBooking } from '@mildshield14/ical-booker';

const creds = {
    principal: 'https://p55-caldav.icloud.com',  // CalDAV server URL
    username: 'your-email@icloud.com',           // Full email address
    password: 'your-app-specific-password'       // App-specific password
};

// 1. Discover available calendars
const calendars = await discoverCalendars(creds);
console.log('Available calendars:', calendars.map(c => c.displayName));

// 2. Check busy times for the next 24 hours
const now = new Date();
const tomorrow = new Date(now.getTime() + 24 * 60 * 60 * 1000);
const busyEvents = await getBusyEvents(creds, calendars, now.toISOString(), tomorrow.toISOString());

console.log('Busy times:');
busyEvents.forEach(event => 
    console.log(`${event.start} - ${event.end}: ${event.title}`)
);

// 3. Create a new booking
const booking = await createBooking(
    { ...creds, calendarURL: calendars[0].url },
    {
        start: '2024-03-15T14:00:00Z',
        end: '2024-03-15T15:00:00Z',
        title: 'Team Meeting',
        attendee: 'colleague@example.com'
    }
);
```

## 📚 API Reference

### `discoverCalendars(credentials)`

Discovers all writable calendar collections for the given CalDAV account.

**Parameters:**
- `credentials` (Object):
  - `principal` (string): CalDAV server URL
  - `username` (string): Full email address
  - `password` (string): App-specific password

**Returns:** `Promise<Calendar[]>`

**Example:**
```javascript
const calendars = await discoverCalendars({
    principal: 'https://p55-caldav.icloud.com',
    username: 'user@icloud.com',
    password: 'app-specific-password'
});
```

### `getBusyEvents(credentials, calendars, startTime, endTime)`

Fetches busy/occupied time slots from the specified calendars.

**Parameters:**
- `credentials` (Object): CalDAV credentials
- `calendars` (Calendar[]): Array of calendar objects from `discoverCalendars`
- `startTime` (string): ISO 8601 start time
- `endTime` (string): ISO 8601 end time

**Returns:** `Promise<BusyEvent[]>`

**Example:**
```javascript
const busyEvents = await getBusyEvents(
    creds,
    calendars,
    '2024-03-15T00:00:00Z',
    '2024-03-15T23:59:59Z'
);
```

### `createBooking(credentials, eventDetails)`

Creates a new calendar event/booking.

**Parameters:**
- `credentials` (Object): CalDAV credentials + `calendarURL`
- `eventDetails` (Object):
  - `start` (string): ISO 8601 start time
  - `end` (string): ISO 8601 end time
  - `title` (string): Event title
  - `attendee` (string, optional): Attendee email

**Returns:** `Promise<BookingResult>`

**Example:**
```javascript
const result = await createBooking(
    { ...creds, calendarURL: calendars[0].url },
    {
        start: '2024-03-15T14:00:00Z',
        end: '2024-03-15T15:00:00Z',
        title: 'Important Meeting',
        attendee: 'attendee@example.com'
    }
);
```

## 🔧 Provider Setup

### iCloud Setup

1. **Generate App-Specific Password:**
   - Go to [appleid.apple.com](https://appleid.apple.com)
   - Sign in and go to Security section
   - Generate an app-specific password for "CalDAV Access"

2. **Find your CalDAV URL:**
   - Use `https://pXX-caldav.icloud.com` (where XX is your partition number)
   - The library will auto-discover the correct partition

```javascript
const icloudCreds = {
    principal: 'https://p55-caldav.icloud.com', // Try different partition numbers
    username: 'your-email@icloud.com',
    password: 'your-app-specific-password'
};
```

### Google Calendar Setup

1. **Enable CalDAV in Google Calendar settings**
2. **Use OAuth2 or App Password:**

```javascript
const googleCreds = {
    principal: 'https://apidata.googleusercontent.com/caldav/v2/',
    username: 'your-email@gmail.com',
    password: 'your-app-password'
};
```

### Fastmail Setup

```javascript
const fastmailCreds = {
    principal: 'https://caldav.fastmail.com/',
    username: 'your-email@fastmail.com',
    password: 'your-password'
};
```

### Generic CalDAV Server

```javascript
const genericCreds = {
    principal: 'https://your-caldav-server.com/',
    username: 'your-username',
    password: 'your-password'
};
```

## 🛡️ Error Handling

The library throws descriptive errors for common issues:

```javascript
try {
    const calendars = await discoverCalendars(creds);
} catch (error) {
    if (error.message.includes('calendar-home-set not found')) {
        console.error('CalDAV server configuration issue');
    } else if (error.message.includes('401')) {
        console.error('Authentication failed - check credentials');
    } else {
        console.error('Unexpected error:', error.message);
    }
}
```

## 🏗️ Building Scheduling Apps

### Check Availability

```javascript
async function findFreeSlots(calendars, date, duration = 60) {
    const dayStart = new Date(date);
    dayStart.setHours(9, 0, 0, 0); // 9 AM
    
    const dayEnd = new Date(date);
    dayEnd.setHours(17, 0, 0, 0); // 5 PM
    
    const busyEvents = await getBusyEvents(
        creds,
        calendars,
        dayStart.toISOString(),
        dayEnd.toISOString()
    );
    
    // Find gaps between busy periods
    const freeSlots = [];
    let currentTime = dayStart;
    
    for (const event of busyEvents.sort((a, b) => new Date(a.start) - new Date(b.start))) {
        const eventStart = new Date(event.start);
        const gap = eventStart - currentTime;
        
        if (gap >= duration * 60 * 1000) { // Duration in milliseconds
            freeSlots.push({
                start: currentTime.toISOString(),
                end: eventStart.toISOString(),
                duration: gap / (60 * 1000) // Minutes
            });
        }
        
        currentTime = new Date(Math.max(currentTime, new Date(event.end)));
    }
    
    return freeSlots;
}
```

### Batch Operations

```javascript
async function checkMultipleCalendars(credentialsList, timeRange) {
    const results = await Promise.all(
        credentialsList.map(async (creds) => {
            try {
                const calendars = await discoverCalendars(creds);
                const busyEvents = await getBusyEvents(creds, calendars, timeRange.start, timeRange.end);
                return { creds, calendars, busyEvents, success: true };
            } catch (error) {
                return { creds, error: error.message, success: false };
            }
        })
    );
    
    return results;
}
```

## 🧪 Testing

```bash
# Run tests
npm test

# Run with coverage
npm run test:coverage

# Test with specific provider
CALDAV_PROVIDER=icloud npm test
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit your changes: `git commit -m 'Add amazing feature'`
4. Push to the branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

## 📝 License

MIT License - see [LICENSE](../Downloads/ical-booker/LICENSE) file for details.

## 🔗 Links

- [GitHub Repository](https://github.com/mildshield14/ical-booker)
- [npm Package](https://www.npmjs.com/package/@mildshield14/ical-booker)
- [CalDAV Specification](https://tools.ietf.org/html/rfc4791)
- [Issues & Bug Reports](https://github.com/mildshield14/ical-booker/issues)

## 📊 Changelog

### v1.0.0
- Initial release
- iCloud, Google Calendar, and Fastmail support
- Calendar discovery and busy time checking
- Event creation functionality

---
