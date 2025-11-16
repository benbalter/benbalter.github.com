# Testing Documentation

This repository includes comprehensive testing for both Jekyll and Next.js builds.

## Test Suites

### 1. Jest Unit Tests (42 tests ✅)

Unit tests for Next.js components and utilities using Jest and React Testing Library.

**Test Files:**
- `app/components/Footer.test.tsx` - Footer component (6 tests)
- `app/components/GitHubAvatar.test.tsx` - Avatar component (6 tests)
- `app/components/ReadingTime.test.tsx` - Reading time (4 tests)
- `lib/avatar.test.ts` - Avatar utilities (6 tests)
- `lib/emoji.test.ts` - Emoji processing (10 tests)
- `lib/mentions.test.ts` - @mention processing (10 tests)

**Commands:**
```bash
npm run test:jest              # Run all tests
npm run test:jest:watch        # Watch mode
npm run test:jest:coverage     # With coverage
```

**Configuration:**
- `jest.config.mjs` - Jest configuration with Next.js support
- `jest.setup.mjs` - Test environment setup

### 2. Playwright E2E Tests (120 tests ✅)

End-to-end tests using Playwright for both Jekyll and Next.js builds.

**Test Files:**
- `e2e/accessibility.spec.ts` - Accessibility compliance
- `e2e/blog-posts.spec.ts` - Blog functionality
- `e2e/homepage.spec.ts` - Homepage tests
- `e2e/pages.spec.ts` - Static pages
- `e2e/performance.spec.ts` - Performance metrics
- `e2e/redirects.spec.ts` - URL redirects
- `e2e/resume.spec.ts` - Resume page
- `e2e/seo.spec.ts` - SEO metadata

**Commands:**
```bash
# Jekyll tests (default)
npm run test:e2e               # Run all E2E tests
npm run test:e2e:headed        # With visible browser
npm run test:e2e:ui            # Interactive UI mode
npm run test:e2e:debug         # Debug mode
npm run test:e2e:report        # View test report

# Next.js tests
npm run test:e2e:nextjs        # Run E2E tests for Next.js build
```

**Configurations:**
- `playwright.config.ts` - Jekyll build testing (port 4000)
- `playwright-nextjs.config.ts` - Next.js build testing (port 3000)

### 3. Node Test Runner Tests

Legacy tests using Node's built-in test runner:
- `lib/plugins.test.ts` - Plugin utilities
- `script/build-related-posts.test.ts` - Related posts algorithm

**Commands:**
```bash
npm run test:related-posts     # Run related posts tests
```

## CI Integration

All tests run automatically in GitHub Actions:

### Jest Tests
- **Workflow:** `.github/workflows/nextjs-jest.yml`
- Runs on push and PRs
- Generates coverage reports
- Uploads artifacts

### Playwright E2E Tests
- **Jekyll:** `.github/workflows/playwright.yml`
- **Next.js:** `.github/workflows/nextjs-e2e.yml`  
- Both run on push and PRs
- Upload test reports and videos
- Test multiple scenarios

### Build Tests
- **Workflow:** `.github/workflows/nextjs-build.yml`
- Verifies Next.js builds successfully

## Test Coverage Summary

| Test Suite | Tests | Status |
|------------|-------|--------|
| Jest Unit Tests | 42 | ✅ All passing |
| Playwright E2E | 120 | ✅ All passing (1 skipped) |
| Node Tests | 18 | ⚠️ 2 failing (pre-existing) |
| **Total** | **180** | **162 passing** |

## Running All Tests

```bash
# Install dependencies
npm ci

# Run Jest tests
npm run test:jest

# Build Next.js site
npm run next:build

# Run Playwright tests for Next.js
npm run test:e2e:nextjs
```

## Test Best Practices

1. **Unit Tests (Jest)**
   - Test components in isolation
   - Mock external dependencies
   - Focus on component behavior and props

2. **E2E Tests (Playwright)**
   - Test user workflows
   - Verify page content and navigation
   - Check accessibility and performance
   - Test both Jekyll and Next.js builds

3. **CI Integration**
   - All tests must pass before merging
   - Coverage reports help identify gaps
   - Test artifacts preserved for debugging

## Key Testing Files

- `.gitignore` - Excludes test artifacts and coverage
- `jest.config.mjs` - Jest configuration
- `playwright.config.ts` - Playwright configuration for Jekyll
- `playwright-nextjs.config.ts` - Playwright configuration for Next.js
- `e2e/helpers.ts` - Shared test utilities

## Troubleshooting

### Jest Issues
- Ensure `NODE_ENV` is set correctly
- Check for module resolution issues
- Verify mocks are working

### Playwright Issues  
- Ensure browsers are installed: `npx playwright install`
- Check server is running on correct port
- Review screenshots/videos in `test-results/`

### CI Failures
- Check workflow logs in GitHub Actions
- Download artifacts for detailed reports
- Verify all dependencies are installed correctly
