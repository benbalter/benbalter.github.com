# Next.js Testing Documentation

This repository includes comprehensive testing for the Next.js build and deployment.

## Test Structure

### Build Tests (`e2e/nextjs-build.spec.ts`)

These tests verify the Next.js build output and static export functionality:

- **Build Output Tests** (11 tests)
  - Verifies `.next` and `out` directories are created
  - Checks for proper manifests (build-manifest.json, prerender-manifest.json)
  - Validates exported pages (index, 404, static pages, blog posts)
  - Ensures trailing slash pattern is followed
  - Verifies static assets (CSS and JS chunks)

- **HTML Structure Tests** (4 tests)
  - Validates HTML structure in exported pages
  - Checks for required metadata
  - Ensures Next.js scripts are included
  - Verifies blog posts have substantial content

- **Configuration Tests** (3 tests)
  - Confirms static export configuration
  - Validates unoptimized images for static export
  - Checks TypeScript configuration

- **Route Generation Tests** (1 test)
  - Verifies all routes from prerender manifest are generated

### E2E Tests (`e2e/nextjs-site.spec.ts`)

These tests run against the Next.js site (either dev server or static export):

- **Homepage Tests** (8 tests)
  - Page loads successfully
  - Correct title and heading
  - Tagline is present
  - Recent posts section displays
  - Blog post links are present
  - Meta tags and language attributes

- **Navigation Tests** (4 tests)
  - Navigate to blog posts
  - Navigate to static pages (about, contact, fine-print)
  - 404 page handling

- **Blog Posts Tests** (2 tests)
  - Blog post content displays
  - Post metadata is present

- **Static Pages Tests** (3 tests)
  - About, Contact, and Fine Print pages load

- **Performance Tests** (2 tests)
  - Homepage loads within reasonable time
  - No JavaScript console errors

- **Accessibility Tests** (2 tests)
  - Semantic HTML structure
  - Accessible links with text or aria-labels

- **SEO Tests** (2 tests)
  - Meta description present
  - Viewport meta tag present

## Running Tests Locally

### Build Tests Only

Run build tests after building the Next.js site:

```bash
npm run next:build
npm run next:test
```

This will:
1. Build the Next.js site (static export to `out/`)
2. Run tests against the build output

### E2E Tests

For E2E tests against the dev server:

```bash
npm run dev  # Start Next.js dev server in another terminal
npm run next:test:e2e
```

Or test against the static export:

```bash
npm run next:build
npx serve out -l 3000  # Start static server in another terminal
BASE_URL=http://localhost:3000 npm run next:test:e2e
```

### All Playwright Tests

To run all E2E tests (both Jekyll and Next.js):

```bash
npm test:e2e
```

## CI/CD Testing

The GitHub Actions workflow `.github/workflows/nextjs-build.yml` includes:

### Build Job
- Builds the Next.js site
- Uploads build artifacts for downstream jobs

### Test Build Job
- Downloads build artifacts
- Runs build validation tests
- Uploads test results

### Test E2E Job
- Builds Next.js site
- Starts Next.js server
- Runs E2E tests against the running server
- Uploads test results

### TypeScript Check Job
- Type checks all TypeScript files
- Lints TypeScript code

## Test Configuration

The `playwright.config.ts` file supports both Jekyll and Next.js testing:

- **Jekyll tests**: Uses `http://localhost:4000` (default)
- **Next.js tests**: Uses `http://localhost:3000` (set via `TEST_NEXTJS` or `BASE_URL`)

## NPM Scripts

- `npm run next:build` - Build Next.js site (static export)
- `npm run next:test` - Run build tests (requires built site)
- `npm run next:test:e2e` - Run E2E tests against Next.js (requires running server)
- `npm run dev` - Start Next.js dev server
- `npm run test:e2e` - Run all Playwright E2E tests
- `npm run test:e2e:headed` - Run E2E tests with browser visible
- `npm run test:e2e:ui` - Open Playwright UI mode
- `npm run test:e2e:debug` - Debug E2E tests
- `npm run test:e2e:report` - Show test report

## Writing New Tests

When adding new Next.js pages or features:

1. Add build validation tests to `e2e/nextjs-build.spec.ts` to verify the build output
2. Add E2E tests to `e2e/nextjs-site.spec.ts` to verify functionality
3. Use helpers from `e2e/helpers.ts` for common checks
4. Follow existing test patterns for consistency

## Test Coverage

Current test coverage includes:

- ✅ Static export build process
- ✅ All page types (index, blog posts, static pages, 404)
- ✅ Static assets (CSS, JS)
- ✅ HTML structure and metadata
- ✅ Navigation between pages
- ✅ Basic accessibility checks
- ✅ SEO metadata
- ✅ Performance (load time, console errors)
- ✅ TypeScript type checking
