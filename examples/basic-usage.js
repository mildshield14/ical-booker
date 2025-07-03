#!/usr/bin/env node

/**
 * Basic usage example for @mildshield14/ical-booker
 *
 * This example demonstrates:
 * 1. Discovering calendars from a CalDAV server
 * 2. Checking busy times for the next 24 hours
 * 3. Creating a new booking/event
 *
 * Setup:
 * npm install @mildshield14/ical-booker dotenv
 *
 * Create a .env file with:
 * CALDAV_PRINCIPAL=https://p55-caldav.icloud.com
 * APPLE_ID=your-email@icloud.com
 * APPLE_APP_PASSWORD=your-app-specific-password
 */

import 'dotenv/config';
import {
    discoverCalendars,
    getBusyEvents,
    createBooking,
} from '@mildshield14/ical-booker';

// Configuration from environment variables
const creds = {
    principal: process.env.CALDAV_PRINCIPAL,
    username: process.env.APPLE_ID,
    password: process.env.APPLE_APP_PASSWORD,
};

// Validate configuration
if (!creds.principal || !creds.username || !creds.password) {
    console.error('❌ Missing required environment variables');
    console.error('Please set CALDAV_PRINCIPAL, APPLE_ID, and APPLE_APP_PASSWORD');
    process.exit(1);
}

async function main() {
    try {
        console.log('🚀 Starting CalDAV example...\n');

        // Step 1: Discover available calendars
        console.log('📅 Discovering calendars...');
        const calendars = await discoverCalendars(creds);

        if (calendars.length === 0) {
            console.log('❌ No calendars found');
            return;
        }

        console.log(`✅ Found ${calendars.length} calendar(s):`);
        calendars.forEach((cal, index) => {
            console.log(`   ${index + 1}. ${cal.displayName}`);
        });
        console.log();

        // Step 2: Check busy times for next 24 hours
        console.log('⏰ Checking busy times for next 24 hours...');
        const now = new Date();
        const tomorrow = new Date(now.getTime() + 24 * 60 * 60 * 1000);

        const busyEvents = await getBusyEvents(
            creds,
            calendars,
            now.toISOString(),
            tomorrow.toISOString()
        );

        if (busyEvents.length === 0) {
            console.log('✅ No busy times found - completely free!');
        } else {
            console.log(`📋 Found ${busyEvents.length} busy time(s):`);
            busyEvents.forEach((event, index) => {
                const start = new Date(event.start).toLocaleString();
                const end = new Date(event.end).toLocaleString();
                console.log(`   ${index + 1}. ${start} - ${end}: ${event.title}`);
            });
        }
        console.log();

        // Step 3: Find a free slot and create a test booking
        console.log('🔍 Looking for free slots...');
        const freeSlots = findFreeSlots(busyEvents, now, tomorrow);

        if (freeSlots.length === 0) {
            console.log('❌ No free slots available for booking');
            return;
        }

        console.log(`✅ Found ${freeSlots.length} free slot(s)`);
        const firstFreeSlot = freeSlots[0];

        // Create a 30-minute test booking in the first free slot
        const bookingStart = new Date(firstFreeSlot.start);
        const bookingEnd = new Date(bookingStart.getTime() + 30 * 60 * 1000); // 30 minutes

        console.log('📝 Creating test booking...');
        console.log(`   Time: ${bookingStart.toLocaleString()} - ${bookingEnd.toLocaleString()}`);
        console.log(`   Calendar: ${calendars[0].displayName}`);

        // Uncomment the following lines to actually create the booking
        /*
        const booking = await createBooking(
            { ...creds, calendarURL: calendars[0].url },
            {
                start: bookingStart.toISOString(),
                end: bookingEnd.toISOString(),
                title: 'Test Booking from CalDAV API',
                description: 'This is a test booking created by the @mildshield14/ical-booker example',
                attendee: 'test@example.com'
            }
        );
        
        if (booking.success) {
            console.log('✅ Booking created successfully!');
            console.log(`   Event UID: ${booking.uid}`);
            console.log(`   Event URL: ${booking.eventURL}`);
        } else {
            console.log('❌ Failed to create booking');
            console.log(`   Error: ${booking.message}`);
        }
        */
        console.log('⚠️  Booking creation is commented out to prevent accidental events');
        console.log('   Uncomment the booking code in the example to actually create events');

    } catch (error) {
        console.error('❌ Error occurred:', error.message);

        // Provide helpful error messages
        if (error.message.includes('401')) {
            console.error('💡 Authentication failed - check your credentials');
        } else if (error.message.includes('calendar-home-set')) {
            console.error('💡 CalDAV server configuration issue - try a different principal URL');
        } else if (error.message.includes('ENOTFOUND')) {
            console.error('💡 Network error - check your internet connection and server URL');
        }

        process.exit(1);
    }
}

/**
 * Find free time slots between busy events
 */
function findFreeSlots(busyEvents, startTime, endTime, minDuration = 30) {
    const freeSlots = [];
    const sortedEvents = busyEvents
        .sort((a, b) => new Date(a.start) - new Date(b.start))
        .filter(event => {
            // Filter out events outside our time range
            const eventStart = new Date(event.start);
            const eventEnd = new Date(event.end);
            return eventEnd > startTime && eventStart < endTime;
        });

    let currentTime = new Date(startTime);

    for (const event of sortedEvents) {
        const eventStart = new Date(event.start);
        const gapMinutes = (eventStart - currentTime) / (1000 * 60);

        if (gapMinutes >= minDuration) {
            freeSlots.push({
                start: currentTime.toISOString(),
                end: eventStart.toISOString(),
                duration: gapMinutes
            });
        }

        currentTime = new Date(Math.max(currentTime, new Date(event.end)));
    }

    // Check for free time after the last event
    const finalGapMinutes = (endTime - currentTime) / (1000 * 60);
    if (finalGapMinutes >= minDuration) {
        freeSlots.push({
            start: currentTime.toISOString(),
            end: endTime.toISOString(),
            duration: finalGapMinutes
        });
    }

    return freeSlots;
}

// Run the example
main().catch(console.error);