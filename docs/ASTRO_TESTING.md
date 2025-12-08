# Astro E2E Testing

This document describes how to run end-to-end tests for the Astro build of Ben Balter's website.

## Overview

The Astro build is a modern static site generator implementation that coexists with Jekyll and Next.js builds. Playwright tests can be run against the Astro build to validate functionality.

## Running Tests

### Quick Start

```bash
# Build the Astro site
npm run astro:build

# Run all E2E tests against Astro
npm run test:e2e:astro
```

### Development Testing

```bash
# Run tests with the dev server (automatically starts)
npm run test:e2e:astro

# Run specific test file
npm run test:e2e:astro -- homepage.spec.ts

# Run tests in headed mode (see browser)
npm run test:e2e:astro -- --headed

# Debug tests
npm run test:e2e:astro -- --debug
```

### CI Testing

In CI environments, you need to:

1. Build the Astro site: `npm run astro:build`
2. Start preview server: `npm run astro:preview` (in background)
3. Run tests: `CI=true npm run test:e2e:astro`

## Configuration

The Astro test configuration is in `playwright-astro.config.ts`:

* **Base URL**: `http://localhost:4321` (Astro's default port)
* **Test Directory**: `./e2e` (shared with other builds)
* **Timeout**: 30 seconds per test
* **Retries**: 2 retries in CI, 0 locally
* **Workers**: 4 parallel workers in CI

## Test Results

### What Works ✅

The following test categories work well with the Astro build:

* **Basic Page Loading**: Pages load successfully
* **Navigation**: Navigation links work correctly
* **Footer**: Footer is present and functional
* **Responsive Design**: Mobile viewport works
* **Meta Tags**: Most meta tags are present
* **Performance**: Fast page loads
* **Accessibility**: Basic accessibility features

### Known Differences ⚠️

The Astro implementation has some differences from Jekyll/Next.js:

1. **Language Attribute**: Uses `lang="en"` instead of `lang="en-US"`
2. **Blog Post Selectors**: Different HTML structure for post listings
3. **Content Pages**: Some static pages have minimal content (About, Contact, Talks)
4. **Social Links**: Different selector patterns
5. **Navigation Structure**: May use different HTML elements

### Test Pass Rates

Based on initial testing:

* **Homepage Tests**: 73% passing (8/11 tests)
* **Static Pages Tests**: 44% passing (7/16 tests)
* **Other Tests**: Not yet validated

## Current Astro Implementation

The Astro build includes:

* **8 pages** generated:
  * Homepage (`/`)
  * About page (`/about/`)
  * Contact page (`/contact/`)
  * Resume page (`/resume/`)
  * Talks page (`/talks/`)
  * Fine Print page (`/fine-print/`)
  * 2 example blog posts (`/posts/example-markdown-post/`, `/posts/example-mdx-post/`)

* **Features**:
  * Markdown and MDX support
  * Static site generation
  * GitHub-style syntax highlighting
  * Content collections with type safety
  * Minimal JavaScript (static HTML)

## Adapting Tests for Astro

If you need to adapt tests for Astro-specific behavior:

1. **Use Conditional Logic**: Check which build is being tested
2. **Update Selectors**: Adjust selectors to match Astro's HTML structure
3. **Skip Tests**: Use `test.skip()` for features not implemented in Astro
4. **Add Astro-Specific Tests**: Create new tests for Astro-only features

Example:

```typescript
test('should have correct lang attribute', async ({ page }) => {
  const html = page.locator('html');
  const lang = await html.getAttribute('lang');
  
  // Astro uses 'en', Jekyll uses 'en-US'
  expect(lang).toMatch(/^en/);
});
```

## Troubleshooting

### Server Not Starting

If the dev server doesn't start automatically:

```bash
# Start server manually
npm run astro:dev

# In another terminal, run tests with CI=true
CI=true npm run test:e2e:astro
```

### Port Conflicts

If port 4321 is already in use:

```bash
# Find process using the port
lsof -ti:4321

# Kill the process
kill <PID>
```

### Test Failures

Common reasons for test failures:

1. **Content Differences**: Astro has example content, not full site content
2. **Selector Mismatches**: Different HTML structure than Jekyll/Next.js
3. **Missing Features**: Some Jekyll features not yet implemented in Astro
4. **Build Issues**: Ensure `npm run astro:build` completes successfully

## Next Steps

To improve Astro test coverage:

1. **Migrate Content**: Copy full content from `_posts/` to `src/content/posts/`
2. **Implement Features**: Add missing features (comments, redirects, etc.)
3. **Update Tests**: Adapt test selectors for Astro's HTML structure
4. **Add Astro Tests**: Create tests for Astro-specific features (MDX components, etc.)
5. **CI Integration**: Add Astro tests to CI pipeline

## Related Documentation

* [Astro Configuration](../astro.config.mjs)
* [Astro Content Documentation](./ASTRO_CONTENT.md)
* [E2E Testing README](../e2e/README.md)
* [Playwright Configuration](../playwright-astro.config.ts)

## Resources

* [Playwright Documentation](https://playwright.dev/)
* [Astro Documentation](https://docs.astro.build/)
* [Astro Testing Guide](https://docs.astro.build/en/guides/testing/)
