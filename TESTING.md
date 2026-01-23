# Testing Documentation

This repository includes comprehensive testing for Jekyll and Astro builds, as well as content quality testing.

## Test Suites

### 1. Prose Quality Tests (920 tests ⚠️)

RSpec tests for content quality and consistency in blog posts.

**Test File:**

- `spec/prose_quality_spec.rb` - Prose structure and quality checks

**Tests:**

- No multiple consecutive blank lines
- No trailing whitespace
- No doubled spaces in prose
- Consistent heading capitalization
- No broken internal links

**Commands:**

```bash
bundle exec rspec spec/prose_quality_spec.rb
```

**Note:** Many posts currently have trailing whitespace issues that should be cleaned up over time.

### 2. Vitest Unit Tests (25 tests ✅)

Unit tests for Astro components and utilities using Vitest.

**Test Files:**

- `src/config.test.ts` - Site configuration (21 tests)
- `src/components/components.test.ts` - Component specification tests (4 tests)

**Commands:**

```bash
npm run test:vitest            # Run all tests
npm run test:vitest:watch      # Watch mode
npm run test:vitest:ui         # Interactive UI mode
npm run test:vitest:coverage   # With coverage
```

**Configuration:**

- `vitest.config.ts` - Vitest configuration with happy-dom environment

**Note:** Component tests are "specification tests" that document expected behavior. They do not test actual component implementations due to Astro's architecture. Full component rendering is tested via E2E tests with Playwright.

### 3. Playwright E2E Tests (✅)

End-to-end tests using Playwright for Jekyll and Astro builds.

**Test Files:**

- `e2e/accessibility.spec.ts` - Accessibility compliance
- `e2e/blog-posts.spec.ts` - Blog functionality
- `e2e/homepage.spec.ts` - Homepage tests
- `e2e/pages.spec.ts` - Static pages
- `e2e/performance.spec.ts` - Performance metrics
- `e2e/redirects.spec.ts` - URL redirects
- `e2e/resume.spec.ts` - Resume page
- `e2e/seo.spec.ts` - SEO metadata

**SEO Test Coverage:**

The SEO test suite comprehensively validates search engine optimization features:

*General SEO Tests (`seo.spec.ts`):*

- Meta descriptions (length validation)
- Open Graph tags (og:title, og:description, og:type, og:url)
- Twitter Card tags
- Canonical URLs
- Title tags (length validation)
- Robots meta tags (indexability)
- Structured data (JSON-LD validation)
- Sitemap accessibility
- robots.txt accessibility
- RSS feed accessibility
- Blog post specific meta tags

**Commands:**

```bash
# Jekyll tests (default)
npm run test:e2e               # Run all E2E tests
npm run test:e2e:headed        # With visible browser
npm run test:e2e:ui            # Interactive UI mode
npm run test:e2e:debug         # Debug mode
npm run test:e2e:report        # View test report

# Astro tests
npm run test:e2e:astro         # Run E2E tests for Astro build
```

**Configurations:**

- `playwright.config.ts` - Jekyll build testing (port 4000)
- `playwright-astro.config.ts` - Astro build testing (port 4321)

### 4. Node Test Runner Tests

Legacy tests using Node's built-in test runner:

- `lib/plugins.test.ts` - Plugin utilities
- `script/build-related-posts.test.ts` - Related posts algorithm

**Commands:**

```bash
npm run test:related-posts     # Run related posts tests
```

## CI Integration

All tests run automatically in GitHub Actions:

### Vitest Tests

- **Workflow:** `.github/workflows/vitest.yml`
- Runs on push and PRs
- Tests Astro components and utilities
- Generates coverage reports

### Playwright E2E Tests

- **Workflow:** `.github/workflows/playwright.yml`
- Runs on push and PRs
- Upload test reports and videos
- Tests Astro build

## Test Coverage Summary

| Test Suite          | Tests | Status                      |
| ------------------- | ----- | --------------------------- |
| Prose Quality Tests | 920   | ⚠️ Some failing (fixable)   |
| Vitest Unit Tests   | 25    | ✅ All passing               |
| Playwright E2E      | ~100+ | ✅ All passing               |
| Node Tests          | 18    | ⚠️ 2 failing (pre-existing) |

## Running All Tests

```bash
# Install dependencies
npm ci

# Run Vitest tests (Astro)
npm run test:vitest

# Build Astro site
npm run astro:build

# Run Playwright tests for Astro
npm run test:e2e:astro
```

## Test Best Practices

1. **Unit Tests (Vitest - Astro)**
   - Test TypeScript logic and interfaces
   - Validate configuration and utilities
   - Component rendering tested via E2E tests

2. **E2E Tests (Playwright)**
   - Test user workflows
   - Verify page content and navigation
   - Check accessibility and performance
   - Test Jekyll and Astro builds

3. **CI Integration**
   - All tests must pass before merging
   - Coverage reports help identify gaps
   - Test artifacts preserved for debugging

## Key Testing Files

- `.gitignore` - Excludes test artifacts and coverage
- `vitest.config.ts` - Vitest configuration for Astro
- `playwright.config.ts` - Playwright configuration for Jekyll
- `playwright-astro.config.ts` - Playwright configuration for Astro
- `e2e/helpers.ts` - Shared test utilities

## Troubleshooting

### Vitest Issues

- Ensure dependencies are installed: `npm ci`
- Check for TypeScript errors: `npm run astro:check`
- Verify test files match pattern: `src/**/*.{test,spec}.{ts,tsx}`

### Playwright Issues  

- Ensure browsers are installed: `npx playwright install`
- Check server is running on correct port
- Review screenshots/videos in `test-results/`

### CI Failures

- Check workflow logs in GitHub Actions
- Download artifacts for detailed reports
- Verify all dependencies are installed correctly

## Prose Linting and Content Quality

In addition to automated tests, this repository uses multiple prose linting tools to ensure content quality. See [docs/PROSE-TESTING.md](docs/PROSE-TESTING.md) for detailed documentation.

### Quick Start

```bash
# Run all prose linting (part of CI)
script/cibuild-content

# Individual tools
npm run lint-md          # Markdown + prose (remark/retext)
npm run lint-text        # Grammar/style (textlint)
script/vale              # Style guide (if installed)
bundle exec rspec spec/prose_quality_spec.rb  # Structure tests
```

### Configuration Files

- `.textlintrc` - Grammar and style rules (textlint)
- `.remarkrc.js` - Markdown and prose linting (remark/retext)
- `.vale.ini` - Style guide configuration (Vale, optional)
- `dictionary.txt` - Custom dictionary for spell checking
- `spec/prose_quality_spec.rb` - Structural quality tests

### Key Features

- **Reduced false positives**: Prose plugins configured to minimize noise
- **Auto-fixing**: Many issues can be fixed automatically
- **Custom dictionary**: Add project-specific terms to avoid false spell-check errors
- **Structural tests**: RSpec tests catch formatting issues (trailing whitespace, broken links)

See the [prose testing documentation](docs/PROSE-TESTING.md) for complete details.
