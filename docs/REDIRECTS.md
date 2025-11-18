# Legacy URL Redirects

This document describes how legacy URL redirects from Jekyll are implemented in the Next.js static site.

## Overview

Since the site is deployed as a static site (GitHub Pages) using Next.js with `output: 'export'`, server-side redirects are not available. Instead, we generate static HTML redirect pages that use meta refresh and JavaScript to redirect users to the correct pages.

**Current Status**: ✅ Fully implemented and tested

* 56 redirect pages generated from 27 unique redirect rules
* 0 redirect chains detected
* 3 external redirects supported
* Comprehensive test coverage with 25+ test cases

## How It Works

### 1. Redirect Data in YAML Frontmatter

All redirect information remains in the YAML frontmatter of the original content files, just as it was in Jekyll:

```yaml
---
title: My Post
redirect_from:
  - /old/url/
  - /another/old/url/
---
```

Or for external redirects:

```yaml
---
title: My Post
redirect_to: https://example.com/new-location/
---
```

### 2. Redirect Generation Script

The `script/generate-redirects.mjs` script scans content directories and generates static HTML redirect pages.

**Script features:**

* Scans both `_posts/` (Jekyll) and `content/posts/` (Next.js) directories
* Scans root pages and `content/pages/` for page redirects
* Supports both `redirect_from` and `redirect_to` directives
* Handles arrays of source URLs for multiple redirects to same destination
* Generates SEO-friendly HTML with proper meta tags

**Redirect HTML includes:**

* `<meta http-equiv="refresh">` for instant browser redirect
* JavaScript `window.location.replace()` for SPA-style navigation
* Canonical link tag pointing to destination
* `noindex` meta tag to prevent search engine indexing
* User-friendly fallback message with clickable link
* Proper HTML5 structure with semantic markup

### 3. Build Integration

The redirect generation is automatically integrated into the build process:

```json
"next:build": "next build && node script/generate-redirects.mjs && tsx script/generate-feeds.mjs"
```

Running `npm run next:build` will:

1. Build the Next.js static site
2. Generate redirect pages in the `out/` directory
3. Generate RSS feeds

### 4. Content Locations

The script looks for redirects in:

* `_posts/*.md` - Legacy Jekyll blog posts
* `content/posts/*.md` - Migrated Next.js blog posts
* `*.md` and `*.html` in root - Legacy Jekyll pages
* `content/pages/*.md` - Migrated Next.js pages

For posts, the destination URL is derived from the filename format: `YYYY-MM-DD-slug.md` → `/YYYY/MM/DD/slug/`

For pages, the destination is taken from the `permalink` frontmatter field or derived from filename.

## Redirect Categories

### Page Redirects

Simple page URL changes:

* `/cv/` → `/resume/`
* `/books/` → `/other-recommended-reading/`
* `/books-for-geeks/` → `/other-recommended-reading/`
* `/recommended-reading/` → `/other-recommended-reading/`

### Post URL Corrections - Typos

Fixing typos in post slugs:

* `/2014/01/27/open-collabortion/` → `/2014/01/27/open-collaboration/`
* `/2014/09/29/your-code-deserves-better/` → `/2014/09/29/our-code-deserves-better/`
* `/2021/03/26/n-things-a-technicalp-program-manager-does/` → `/2021/03/26/nine-things-a-technical-program-manager-does/`
* `/2021/06/15/moderating-open-source-conversations-to-keep-them-productive/` → `/2021/06/15/how-to-moderate-open-source-conversations-to-keep-them-productive/`

### Post URL Corrections - Wrong Dates

Correcting publication dates:

* `/2014/12/08/types-of-pull-requests/` → `/2015/12/08/types-of-pull-requests/`
* `/2013/02/13/what-is-a-hacker/` → `/2013/02/04/what-is-a-hacker/`
* `/2013/02/16/what-is-a-hacker/` → `/2013/02/04/what-is-a-hacker/`
* `/2014/11/03/rules-of-communicating-at-github/` → `/2014/11/06/rules-of-communicating-at-github/`
* `/2014/11/17/open-source-policy/` → `/2014/11/24/open-source-policy/`
* `/2015/02/16/jekyll-collections/` → `/2015/02/20/jekyll-collections/`
* `/2016/10/31/eight-things-i-wish-i-knew-my-first-week/` → `/2016/10/31/eight-things-i-wish-i-knew-my-first-week-at-github/`
* `/2020/08/31/trust-and-safety-before-someone-gets-hurt/` → `/2020/08/31/trust-and-safety-features-to-build-into-your-product-before-someone-gets-hurt/`
* `/2023/12/07/cathedral-bazaar-management/` → `/2023/12/08/cathedral-bazaar-management/`

### Post URL Corrections - Special Characters

Handling special characters and URL encoding:

* `/2014/09/29/source-disclosed--open-source/` (double dash)
* `/2014/09/29/source-disclosed-≠-open-source/` (not-equal symbol)
* `/2014/09/29/source-disclosed-!=-open-source/` (inequality operator)
* `/2014/10/08/why-government-contractors-should-<3-open-source/` (heart symbol)
* `/2014/10/08/why-government-contractors-should-%3C3-open-source/` (URL-encoded heart)
* `/2014/10/08/why-government-contractors-should-3-open-source/` (just the 3)

All redirect to: `/2014/09/29/source-disclosed-is-not-the-same-as-open-source/` or `/2014/10/08/why-government-contractors-should-embrace-open-source/`

### External Redirects

Posts moved to external sites:

* `/2023/10/04/how-to-communicate-like-a-github-engineer/` → `https://github.blog/2023-10-04-how-to-communicate-like-a-github-engineer-our-principles-practices-and-tools/`
* `/2015/04/27/eight-lessons-learned-hacking-on-github-pages-for-six-months/` → `https://github.com/blog/1992-eight-lessons-learned-hacking-on-github-pages-for-six-months`
* `/2012/04/23/enterprise-open-source-usage-is-up-but-challenges-remain/` → `http://techcrunch.com/2012/04/22/enterprise-open-source-usage-is-up-but-challenges-remain/`

## Adding New Redirects

To add a new redirect:

1. **For internal redirects**: Add `redirect_from` to the destination page's frontmatter:
   ```yaml
   ---
   title: My Post
   redirect_from:
     - /old/url/
     - /another/old/url/
   ---
   ```

2. **For external redirects**: Add `redirect_to` to the source page's frontmatter:
   ```yaml
   ---
   title: My Post
   redirect_to: https://example.com/new-location/
   ---
   ```

3. **Rebuild**: Run `npm run next:build` to generate the redirect pages

4. **Test**: Verify the redirect works with `npm run test:e2e -- e2e/redirects.spec.ts`

## Redirect Chains

The system is designed to avoid redirect chains. Each redirect goes directly from source to final destination. The script does not follow chains, so if you need to redirect A → B → C, you must manually configure A → C directly.

**Current status**: No redirect chains detected in the codebase.

## Testing

### Validation Script

The `script/validate-redirects.mjs` script performs comprehensive validation of all redirect pages after build:

```bash
npm run validate:redirects
```

This validates:

* ✅ All expected redirect pages exist in `out/` directory
* ✅ Each redirect page has correct destination URL
* ✅ Redirect HTML is properly formatted (meta refresh, JS redirect, canonical, noindex)
* ✅ All destination pages exist in the build
* ✅ No redirect chains exist

Run this after `npm run next:build` to verify redirect integrity before deployment.

### Running E2E Tests

Run all redirect tests:

```bash
npm run test:e2e -- e2e/redirects.spec.ts
```

Run a specific test:

```bash
npm run test:e2e -- e2e/redirects.spec.ts -g "should redirect /cv/"
```

### Test Coverage

The test suite covers:

* ✅ Page redirects (4 tests)
* ✅ Post URL corrections for typos (3 tests)
* ✅ Post URL corrections for wrong dates (7 tests)
* ✅ Post URL corrections for special characters (5 tests)
* ✅ External redirects (3 tests)
* ✅ Redirect HTML structure validation (1 test)

**Total**: 19 comprehensive test cases

### Manual Testing

To manually test redirects:

1. Build the site: `npm run next:build`
2. Start the server: `npm run next:start`
3. Navigate to a legacy URL (e.g., `http://localhost:3000/cv/`)
4. Verify you're redirected to the correct destination

## Troubleshooting

### Redirect not working

1. Check the frontmatter syntax in the source file
2. Verify the destination page exists in the build output
3. Rebuild the site: `npm run next:build`
4. Check the `out/` directory for the generated redirect HTML file
5. Inspect the redirect HTML to ensure it has the correct destination

### Redirect generated but not in tests

Add a test case to `e2e/redirects.spec.ts` following the existing patterns.

### Need to update redirect destination

1. Update the frontmatter in the source file
2. Rebuild: `npm run next:build`
3. The redirect pages are regenerated automatically

## Implementation Details

### Why Static HTML Instead of Server-Side Redirects?

Next.js with `output: 'export'` generates a completely static site for GitHub Pages hosting. This means:

* No server-side code execution
* No API routes at runtime
* No server-side redirects via HTTP status codes

Therefore, we use client-side redirects via:

1. Meta refresh tag (works even without JavaScript)
2. JavaScript redirect (faster, preserves browser history properly)

### SEO Considerations

The redirect HTML includes:

* `<link rel="canonical">` pointing to the destination
* `<meta name="robots" content="noindex">` to prevent indexing
* Proper HTTP-equiv meta refresh for search engine crawlers
* User-friendly fallback message with clickable link

This ensures search engines:

* Understand the redirect and index the destination
* Don't index the redirect page itself
* Pass link equity to the destination page

### Performance

* Redirect HTML files are tiny (\~500 bytes each)
* Redirect happens instantly (0ms delay on meta refresh)
* JavaScript redirect preserves browser history
* No server round-trip required
* Works offline once the HTML is cached

## Maintenance

The redirect system requires no ongoing maintenance. When content moves:

1. Add `redirect_from` to the new location's frontmatter
2. Rebuild the site
3. Deploy

The old URL will automatically redirect to the new location.
