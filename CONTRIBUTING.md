# Contributing to @mildshield14/ical-booker

Thank you for your interest in contributing to @mildshield14/ical-booker! This document provides guidelines and information for contributing to this project.

## 🤝 How to Contribute

### Reporting Bugs

Before creating bug reports, please check the [existing issues](https://github.com/mildshield14/ical-booker/issues) to avoid duplicates.

**When creating a bug report, please include:**
- Clear, descriptive title
- Steps to reproduce the issue
- Expected vs actual behavior
- CalDAV provider (iCloud, Google, Fastmail, etc.)
- Node.js version and operating system
- Code samples that demonstrate the issue
- Relevant error messages or logs

### Suggesting Features

Feature requests are welcome! Please:
- Check existing [discussions](https://github.com/mildshield14/ical-booker/discussions) first
- Clearly describe the use case and benefits
- Consider backward compatibility
- Provide examples of how the feature would be used

### Code Contributions

1. **Fork the repository**
   ```bash
   git clone https://github.com/your-username/ical-booker.git
   cd ical-booker
   ```

2. **Create a branch**
   ```bash
   git checkout -b feature/amazing-feature
   # or
   git checkout -b fix/important-bug
   ```

3. **Set up development environment**
   ```bash
   npm install
   npm run build
   npm test
   ```

4. **Make your changes**
    - Write clear, documented code
    - Add tests for new functionality
    - Update TypeScript types as needed
    - Follow the existing code style

5. **Test your changes**
   ```bash
   npm run lint
   npm run format
   npm run build
   npm test
   ```

6. **Commit and push**
   ```bash
   git add .
   git commit -m "feat: add amazing feature"
   git push origin feature/amazing-feature
   ```

7. **Create a Pull Request**
    - Use a clear, descriptive title
    - Reference related issues
    - Describe what changes were made and why

## 🛠️ Development Setup

### Prerequisites
- Node.js 18+
- npm 9+
- Git

### Installation
```bash
# Clone the repository
git clone https://github.com/mildshield14/ical-booker.git
cd ical-booker

# Install dependencies
npm install

# Build the project
npm run build

# Run tests
npm test
```

### Project Structure
```
src/
├── lib/
│   ├── discover.ts    # Calendar discovery logic
│   ├── busy.ts        # Busy time checking
│   ├── booking.ts     # Event creation
│   ├── types.ts       # TypeScript definitions
│   └── utils.ts       # Utility functions
├── index.ts           # Main exports
examples/
├── basic-usage.js     # Usage examples
tests/
├── unit/              # Unit tests
├── integration/       # Integration tests
└── fixtures/          # Test data
```

### Scripts
- `npm run build` - Compile TypeScript
- `npm run dev` - Watch mode for development
- `npm test` - Run all tests
- `npm run test:coverage` - Run tests with coverage
- `npm run lint` - Check code style
- `npm run lint:fix` - Fix linting issues
- `npm run format` - Format code with Prettier

## 📋 Coding Standards

### TypeScript
- Use strict TypeScript configuration
- Provide comprehensive type definitions
- Avoid `any` types when possible
- Document complex types with JSDoc

### Code Style
- Follow ESLint and Prettier configurations
- Use descriptive variable and function names
- Write self-documenting code
- Add JSDoc comments for public APIs

### Testing
- Write unit tests for all new functions
- Include integration tests for CalDAV providers
- Test error conditions and edge cases
- Maintain high test coverage (>90%)

### Documentation
- Update README.md for new features
- Add JSDoc comments to public APIs
- Include usage examples
- Update CHANGELOG.md

## 🧪 Testing

### Unit Tests
```bash
npm test
```

### Integration Tests
Integration tests require real CalDAV credentials. Create a `.env.test` file:
```env
CALDAV_PRINCIPAL=https://test-server.com
TEST_USERNAME=test@example.com
TEST_PASSWORD=test-password
```

Then run:
```bash
npm run test:integration
```

### Testing with Different Providers
- **iCloud**: Requires app-specific password
- **Google**: Requires OAuth setup
- **Fastmail**: Direct credentials work
- **Generic**: Test with any CalDAV server

## 🔄 Release Process

1. Update version in `package.json`
2. Update `CHANGELOG.md`
3. Create release PR
4. Merge to main branch
5. Create GitHub release
6. Automated npm publishing via GitHub Actions

## 🐛 Debugging

### Enable Debug Logging
```javascript
import { discoverCalendars } from '@mildshield14/ical-booker';

// Enable console.debug output
console.debug = console.log;

const calendars = await discoverCalendars(creds);
```

### Common Issues
- **Authentication**: Check app-specific passwords
- **URLs**: Verify CalDAV server URLs
- **Network**: Test connectivity to CalDAV servers
- **Permissions**: Ensure calendar write access

## 📞 Getting Help

- **Discussions**: [GitHub Discussions](https://github.com/mildshield14/ical-booker/discussions)
- **Issues**: [GitHub Issues](https://github.com/mildshield14/ical-booker/issues)
- **Email**: Create an issue for private matters

## 📄 License

By contributing to this project, you agree that your contributions will be licensed under the MIT License.

## 🙏 Recognition

Contributors will be recognized in:
- GitHub contributors list
- CHANGELOG.md release notes
- README.md acknowledgments (for significant contributions)

Thank you for helping make @mildshield14/ical-booker better! 🎉