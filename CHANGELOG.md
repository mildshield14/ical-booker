# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added
- Feature requests and improvements in development

### Changed
- Performance optimizations planned

### Fixed
- Bug fixes in progress

## [1.0.0] - 2024-07-02

### Added
- Initial release of @mildshield14/ical-booker
- 🔍 **Calendar Discovery**: Automatic discovery of calendar collections from CalDAV servers
- 📅 **Multi-provider Support**: Works with iCloud, Google Calendar, Fastmail, and other CalDAV servers
- ⚡ **Busy Time Checking**: Fetch busy/free information for scheduling applications
- 📝 **Event Creation**: Create calendar events with attendees
- 🔒 **Secure Authentication**: Support for app-specific passwords and OAuth tokens
- 🪶 **Lightweight Design**: Minimal dependencies with ESM-first architecture

### Core Functions
- `discoverCalendars()` - Discover writable calendar collections
- `getBusyEvents()` - Retrieve busy/occupied time slots
- `createBooking()` - Create new calendar events/bookings

### Provider Support
- **iCloud**: Full support with automatic partition detection
- **Google Calendar**: CalDAV integration with OAuth support
- **Fastmail**: Native CalDAV support
- **Generic CalDAV**: Compatible with RFC 4791 compliant servers

### Technical Features
- TypeScript support with comprehensive type definitions
- ESM modules for modern Node.js applications
- Robust error handling and fallback mechanisms
- Extensive logging for debugging CalDAV interactions
- Automatic URL construction and principal discovery

### Documentation
- Comprehensive README with usage examples
- API documentation with type definitions
- Provider-specific setup guides
- Example code for common use cases

### Testing
- Unit tests for core functionality
- Integration tests with major CalDAV providers
- Error handling verification
- Performance benchmarks

---

## Release Notes

### v1.0.0 Highlights

This initial release focuses on providing a robust, easy-to-use CalDAV client that handles the complexity of calendar discovery and busy time checking. The library has been tested with major CalDAV providers and includes comprehensive error handling for production use.

**Key Benefits:**
- **Simplified Integration**: No need to understand CalDAV protocols - just provide credentials
- **Provider Agnostic**: Works with any RFC 4791 compliant CalDAV server
- **Production Ready**: Comprehensive error handling and fallback mechanisms
- **TypeScript First**: Full type safety and IntelliSense support
- **Modern Architecture**: ESM modules, async/await, and clean APIs

**What's Next:**
- Enhanced recurrence rule support
- Batch operations for multiple calendars
- Real-time change notifications
- Calendar sync capabilities
- Performance optimizations

### Migration Guide

This is the initial release, so no migration is needed. For future versions, migration guides will be provided here.

### Breaking Changes

None for initial release.

### Security Notes

- Always use app-specific passwords instead of main account passwords
- Store credentials securely using environment variables or secure credential stores
- Validate all user inputs before passing to CalDAV functions
- Monitor for unauthorized access attempts in production environments

### Known Issues

- iCloud partition auto-detection may require manual URL adjustment for some accounts
- Some CalDAV servers may have rate limiting that affects bulk operations
- Timezone handling relies on server-provided information

### Support

- 🐛 **Bug Reports**: [GitHub Issues](https://github.com/mildshield14/ical-booker/issues)
- 💡 **Feature Requests**: [GitHub Discussions](https://github.com/mildshield14/ical-booker/discussions)
- 📖 **Documentation**: [README.md](https://github.com/mildshield14/ical-booker#readme)
- 📦 **npm Package**: [@mildshield14/ical-booker](https://www.npmjs.com/package/@mildshield14/ical-booker)