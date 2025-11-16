# Next.js URL Routing and Static Site Generation

This document describes the Next.js routing implementation for Ben Balter's website, ensuring full compatibility with Jekyll's URL structure while leveraging Next.js's static site generation capabilities.

## Overview

The website uses Next.js App Router with Static Site Generation (SSG) to pre-render all pages at build time, maintaining compatibility with Jekyll's permalink structure while enabling deployment to GitHub Pages.

## Routing Architecture

### Dynamic Routes

The site uses two main dynamic route patterns:

#### 1. Blog Posts: `app/[year]/[month]/[day]/[slug]/page.tsx`

Handles all blog posts using Jekyll's permalink format: `/YYYY/MM/DD/slug/`

**Example URLs:**
- `/2024/01/08/dissenting-voices/`
- `/2023/12/08/cathedral-bazaar-management/`
- `/2022/02/16/leaders-show-their-work/`

**Implementation:**
```typescript
export async function generateStaticParams() {
  const posts = getAllPosts();
  return posts.map(post => {
    const [year, month, day, ...rest] = post.slug.split('-');
    return { year, month, day, slug: rest.join('-') };
  });
}
```

**Content Source:** `content/posts/YYYY-MM-DD-slug.md`

#### 2. Static Pages: `app/[slug]/page.tsx`

Handles all static pages like About, Contact, Resume, etc.

**Example URLs:**
- `/about/`
- `/contact/`
- `/resume/`
- `/talks/`

**Implementation:**
```typescript
export async function generateStaticParams() {
  const slugs = getAllPageSlugs();
  return slugs.map((slug) => ({ slug }));
}
```

**Content Source:** `content/pages/slug.md` or `content/pages/slug.html`

### Home Page

The home page (`app/page.tsx`) displays a list of all blog posts, sorted by date (newest first).

### 404 Page

The 404 page (`app/not-found.tsx`) handles invalid routes with a user-friendly error message.

## Static Site Generation (SSG)

### Build Process

1. **Content Loading:** All markdown files are read from `content/posts/` and `content/pages/`
2. **Route Generation:** `generateStaticParams()` creates static parameters for all routes
3. **Pre-rendering:** Next.js renders each route at build time
4. **Export:** Static HTML files are exported to `out/` directory
5. **Redirects:** Legacy URL redirects are generated via `script/generate-redirects.mjs`

### Build Command

```bash
npm run next:build
```

This runs:
1. `next build` - Generates static site
2. `script/generate-redirects.mjs` - Creates redirect pages
3. `script/generate-feeds.mjs` - Generates RSS feeds

### Output Structure

```
out/
├── index.html                           # Home page
├── about/index.html                     # Static page
├── contact/index.html                   # Static page
├── 2024/01/08/dissenting-voices/       # Blog post
│   └── index.html
├── cv/index.html                        # Redirect page
└── _next/                               # Next.js assets
```

## Legacy URL Redirects

### Implementation

Legacy URLs from Jekyll are handled via static HTML redirect pages with:
1. Meta refresh tag
2. JavaScript `window.location.replace()`
3. Fallback link for non-JavaScript browsers

### Redirect Types

#### 1. `redirect_from` - Internal Redirects

Pages can specify old URLs that should redirect to the current page:

```yaml
---
title: Resume
permalink: /resume/
redirect_from: /cv/
---
```

**Result:** `/cv/` → `/resume/`

#### 2. `redirect_to` - External Redirects

Pages can redirect to external URLs:

```yaml
---
redirect_to: https://github.blog/article
---
```

**Result:** Shows redirect page with link to external site

### Redirect Generation

Redirects are generated post-build by `script/generate-redirects.mjs`:

```bash
node script/generate-redirects.mjs
```

This scans all content files for `redirect_from` and `redirect_to` directives and creates static HTML redirect pages in the `out/` directory.

## Content Structure

### Blog Posts

**Location:** `content/posts/`

**Filename Format:** `YYYY-MM-DD-slug.md`

**Frontmatter:**
```yaml
---
title: Post Title
description: Post description for SEO
date: YYYY-MM-DD
redirect_from:
  - /old-url/
---
```

**URL Format:** `/YYYY/MM/DD/slug/`

### Static Pages

**Location:** `content/pages/`

**Filename:** `slug.md` or `slug.html`

**Frontmatter:**
```yaml
---
title: Page Title
description: Page description for SEO
permalink: /custom-url/
redirect_from:
  - /old-url/
---
```

**URL Format:** `/slug/` or custom via `permalink`

## Validation & Testing

### Test Suites

#### 1. URL Structure Validation (`e2e/url-structure.spec.ts`)

Validates:
- All blog posts accessible via Jekyll-style URLs
- All static pages accessible
- Home page loads correctly
- 404 handling
- SSG pre-rendering
- Correct number of routes generated

#### 2. Redirect Validation (`e2e/redirects.spec.ts`)

Validates:
- Internal redirects work correctly
- Post URL corrections (typos, date changes)
- External redirects display correctly
- Redirect pages contain proper meta tags and JavaScript

#### 3. Link Validation (`e2e/link-validation.spec.ts`)

Validates:
- Homepage internal links
- Blog post internal links
- Static page internal links
- Navigation links
- Footer links
- No broken internal links

### Running Tests

```bash
# Run all validation tests
npm run test:e2e:nextjs -- e2e/url-structure.spec.ts e2e/redirects.spec.ts e2e/link-validation.spec.ts

# Run specific test suite
npm run test:e2e:nextjs -- e2e/url-structure.spec.ts
```

## Statistics

### Current Site Scale

- **Blog Posts:** 184 posts
- **Static Pages:** 9 pages
- **Redirect Pages:** 56 redirects
- **Total HTML Files:** ~219 files

### All Tests Passing ✅

- **URL Structure Tests:** 9/9 passing
- **Redirect Tests:** 6/6 passing
- **Link Validation Tests:** 6/6 passing
- **Total:** 21/21 tests passing

## Server Components

The entire site uses React Server Components by default, minimizing client-side JavaScript:

- **Zero 'use client' directives** in page routes
- **Static HTML generation** for all content
- **Minimal JavaScript** - only for Bootstrap and navigation highlighting
- **Optimal performance** - pre-rendered HTML served directly

## Deployment

The site is deployed to GitHub Pages using the static export:

1. **Build:** `npm run next:build`
2. **Output:** `out/` directory contains static site
3. **Deploy:** `out/` directory published to GitHub Pages
4. **Serve:** GitHub Pages serves static HTML files

## Migration Notes

### From Jekyll to Next.js

✅ **Preserved:**
- All blog post URLs (`/YYYY/MM/DD/slug/`)
- All static page URLs (`/slug/`)
- All redirect functionality
- Same content structure
- Same permalink patterns

✅ **Improved:**
- Modern React-based templating
- Type-safe TypeScript code
- Component-based architecture
- Better developer experience
- Incremental migration path

## Troubleshooting

### Build Errors

**Problem:** Build fails with "Cannot find module"
**Solution:** Run `npm install` to ensure all dependencies are installed

**Problem:** "No such file or directory: content/posts"
**Solution:** Ensure content is properly migrated from Jekyll directories

### Test Failures

**Problem:** Tests fail with "ERR_CONNECTION_REFUSED"
**Solution:** Ensure the dev server is running: `npm run next:start`

**Problem:** Playwright browser not found
**Solution:** Install browsers: `npx playwright install chromium`

### Redirect Issues

**Problem:** Redirects not working after build
**Solution:** Ensure `script/generate-redirects.mjs` runs after `next build`

**Problem:** Redirect shows but doesn't navigate
**Solution:** Check JavaScript is enabled in browser; redirect uses JavaScript for instant navigation

## Future Enhancements

Possible improvements for the routing system:

1. **Dynamic OG Images:** Generate open graph images at build time per post
2. **Related Posts:** Add dynamic routing for related post recommendations
3. **Search:** Add client-side search with pre-indexed content
4. **Archive Pages:** Generate archive pages by year/month
5. **Tag Pages:** Generate dynamic tag archive pages

## References

- [Next.js App Router Documentation](https://nextjs.org/docs/app)
- [Next.js Static Exports](https://nextjs.org/docs/app/building-your-application/deploying/static-exports)
- [Jekyll Permalinks](https://jekyllrb.com/docs/permalinks/)
- [GitHub Pages Documentation](https://docs.github.com/en/pages)
