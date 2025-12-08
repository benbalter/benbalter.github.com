# Testing Documentation

This repository includes comprehensive testing for both Jekyll and Next.js builds, as well as content quality testing.

## Test Suites

### 1. Prose Quality Tests (920 tests ⚠️)

RSpec tests for content quality and consistency in blog posts.

**Test File:**

* `spec/prose_quality_spec.rb` - Prose structure and quality checks

**Tests:**

* No multiple consecutive blank lines
* No trailing whitespace
* No doubled spaces in prose
* Consistent heading capitalization
* No broken internal links

**Commands:**

```bash
bundle exec rspec spec/prose_quality_spec.rb
```

**Note:** Many posts currently have trailing whitespace issues that should be cleaned up over time.

### 2. Jest Unit Tests (42 tests ✅)

Unit tests for Next.js components and utilities using Jest and React Testing Library.

**Test Files:**

* `app/components/Footer.test.tsx` - Footer component (6 tests)
* `app/components/GitHubAvatar.test.tsx` - Avatar component (6 tests)
* `app/components/ReadingTime.test.tsx` - Reading time (4 tests)
* `lib/avatar.test.ts` - Avatar utilities (6 tests)
* `lib/emoji.test.ts` - Emoji processing (10 tests)
* `lib/mentions.test.ts` - @mention processing (10 tests)

**Commands:**

```bash
npm run test:jest              # Run all tests
npm run test:jest:watch        # Watch mode
npm run test:jest:coverage     # With coverage
```

**Configuration:**

* `jest.config.mjs` - Jest configuration with Next.js support
* `jest.setup.mjs` - Test environment setup

### 3. Vitest Unit Tests (30 tests ✅)

Unit tests for Astro components and utilities using Vitest.

**Test Files:**

* `src/config.test.ts` - Site configuration (21 tests)
* `src/components/components.test.ts` - Component logic and interfaces (9 tests)

**Commands:**

```bash
npm run test:vitest            # Run all tests
npm run test:vitest:watch      # Watch mode
npm run test:vitest:ui         # Interactive UI mode
npm run test:vitest:coverage   # With coverage
```

**Configuration:**

* `vitest.config.ts` - Vitest configuration with happy-dom environment

**Note:** Astro components are tested for their TypeScript logic and interfaces. Full component rendering is tested via E2E tests with Playwright.

### 4. Playwright E2E Tests (141 tests ✅)

End-to-end tests using Playwright for both Jekyll and Next.js builds.

**Test Files:**

* `e2e/accessibility.spec.ts` - Accessibility compliance
* `e2e/blog-posts.spec.ts` - Blog functionality
* `e2e/homepage.spec.ts` - Homepage tests
* `e2e/pages.spec.ts` - Static pages
* `e2e/performance.spec.ts` - Performance metrics
* `e2e/redirects.spec.ts` - URL redirects
* `e2e/resume.spec.ts` - Resume page
* `e2e/seo.spec.ts` - SEO metadata (general) - 25 tests
* `e2e/seo-nextjs.spec.ts` - Next.js-specific SEO tests - 21 tests

**SEO Test Coverage (46 total tests):**

The SEO test suite comprehensively validates search engine optimization features:

*General SEO Tests (`seo.spec.ts` - 25 tests):*
* Meta descriptions (length validation)
* Open Graph tags (og:title, og:description, og:type, og:url)
* Twitter Card tags
* Canonical URLs
* Title tags (length validation)
* Robots meta tags (indexability)
* Structured data (JSON-LD validation)
* Sitemap accessibility
* robots.txt accessibility
* RSS feed accessibility
* Blog post specific meta tags

*Next.js-Specific SEO Tests (`seo-nextjs.spec.ts` - 21 tests):*
* UTF-8 charset declaration
* Viewport meta tag for responsive design
* Theme-color meta tags (light/dark mode)
* X-UA-Compatible for IE
* Open Graph image tags (og:image, og:image:alt)
* Twitter image tags
* Author, creator, and publisher metadata
* Person structured data schema
* BlogPosting structured data schema
* Social media rel="me" links
* RSS feed alternate link
* Favicon and icon links (multiple formats)
* Web manifest link
* Article-specific Open Graph tags
* Published time metadata
* Twitter Card types
* Keywords meta tag
* Robots and indexing rules validation

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

* `playwright.config.ts` - Jekyll build testing (port 4000)
* `playwright-nextjs.config.ts` - Next.js build testing (port 3000)

### 5. Node Test Runner Tests

Legacy tests using Node's built-in test runner:

* `lib/plugins.test.ts` - Plugin utilities
* `script/build-related-posts.test.ts` - Related posts algorithm

**Commands:**

```bash
npm run test:related-posts     # Run related posts tests
```

## CI Integration

All tests run automatically in GitHub Actions:

### Jest Tests

* **Workflow:** `.github/workflows/nextjs-jest.yml`
* Runs on push and PRs
* Generates coverage reports
* Uploads artifacts

### Vitest Tests

* **Workflow:** `.github/workflows/astro-vitest.yml` (to be added)
* Runs on push and PRs
* Tests Astro components and utilities
* Generates coverage reports

### Playwright E2E Tests

* **Jekyll:** `.github/workflows/playwright.yml`
* **Next.js:** `.github/workflows/nextjs-e2e.yml`  
* Both run on push and PRs
* Upload test reports and videos
* Test multiple scenarios

### Build Tests

* **Workflow:** `.github/workflows/nextjs-build.yml`
* Verifies Next.js builds successfully

## Test Coverage Summary

| Test Suite          | Tests | Status                      |
| ------------------- | ----- | --------------------------- |
| Prose Quality Tests | 920   | ⚠️ 206 failing (fixable)    |
| Jest Unit Tests     | 42    | ✅ All passing               |
| Vitest Unit Tests   | 30    | ✅ All passing               |
| Playwright E2E      | 141   | ✅ All passing (1 skipped)   |
| Node Tests          | 18    | ⚠️ 2 failing (pre-existing) |
| **Total**           | **1151** | **1123 passing**         |

## Running All Tests

```bash
# Install dependencies
npm ci

# Run Jest tests (Next.js)
npm run test:jest

# Run Vitest tests (Astro)
npm run test:vitest

# Build Next.js site
npm run next:build

# Run Playwright tests for Next.js
npm run test:e2e:nextjs

# Build Astro site
npm run astro:build

# Run Playwright tests for Astro
npm run test:e2e:astro
```

## Test Best Practices

1. **Unit Tests (Jest - Next.js)**
   * Test components in isolation
   * Mock external dependencies
   * Focus on component behavior and props

2. **Unit Tests (Vitest - Astro)**
   * Test TypeScript logic and interfaces
   * Validate configuration and utilities
   * Component rendering tested via E2E tests

3. **E2E Tests (Playwright)**
   * Test user workflows
   * Verify page content and navigation
   * Check accessibility and performance
   * Test Jekyll, Next.js, and Astro builds

3. **CI Integration**
   * All tests must pass before merging
   * Coverage reports help identify gaps
   * Test artifacts preserved for debugging

## Key Testing Files

* `.gitignore` - Excludes test artifacts and coverage
* `jest.config.mjs` - Jest configuration for Next.js
* `vitest.config.ts` - Vitest configuration for Astro
* `playwright.config.ts` - Playwright configuration for Jekyll
* `playwright-nextjs.config.ts` - Playwright configuration for Next.js
* `e2e/helpers.ts` - Shared test utilities

## Troubleshooting

### Jest Issues

* Ensure `NODE_ENV` is set correctly
* Check for module resolution issues
* Verify mocks are working

### Vitest Issues

* Ensure dependencies are installed: `npm ci`
* Check for TypeScript errors: `npm run astro:check`
* Verify test files match pattern: `src/**/*.{test,spec}.{ts,tsx}`

### Playwright Issues  

* Ensure browsers are installed: `npx playwright install`
* Check server is running on correct port
* Review screenshots/videos in `test-results/`

### CI Failures

* Check workflow logs in GitHub Actions
* Download artifacts for detailed reports
* Verify all dependencies are installed correctly

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

* `.textlintrc` - Grammar and style rules (textlint)
* `.remarkrc.js` - Markdown and prose linting (remark/retext)
* `.vale.ini` - Style guide configuration (Vale, optional)
* `dictionary.txt` - Custom dictionary for spell checking
* `spec/prose_quality_spec.rb` - Structural quality tests

### Key Features

* **Reduced false positives**: Prose plugins configured to minimize noise
* **Auto-fixing**: Many issues can be fixed automatically
* **Custom dictionary**: Add project-specific terms to avoid false spell-check errors
* **Structural tests**: RSpec tests catch formatting issues (trailing whitespace, broken links)

See the [prose testing documentation](docs/PROSE-TESTING.md) for complete details.

* Check workflow logs in GitHub Actions
* Download artifacts for detailed reports
* Verify all dependencies are installed correctly
