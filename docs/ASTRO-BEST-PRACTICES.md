# Astro Best Practices Guide

**Last Updated:** December 10, 2024  
**Astro Version:** 5.x  
**Status:** Active Implementation

This guide documents Astro best practices for ben.balter.com, focusing on performance, SEO, and accessibility.

---

## Table of Contents

1. [Performance Best Practices](#performance-best-practices)
2. [SEO Best Practices](#seo-best-practices)
3. [Accessibility Best Practices](#accessibility-best-practices)
4. [Build Optimization](#build-optimization)
5. [Component Architecture](#component-architecture)
6. [Testing Strategy](#testing-strategy)
7. [Checklist](#implementation-checklist)

---

## Performance Best Practices

### 1. Zero-JavaScript by Default ✅

**Status:** IMPLEMENTED

Astro ships static HTML by default, only sending JavaScript for interactive components.

**Implementation:**

- All pages are server-rendered at build time
- Only 2 client components in entire site:
  - `Navigation.astro` (uses `usePathname` hook)
  - `src/scripts/fontawesome.ts` and `src/scripts/navToggle.ts` (client-side initialization)

**Why:** Reduces bundle size, improves Core Web Vitals (LCP, FID), faster page loads.

**Verification:**

```bash
npm run astro:build
# Check dist-astro/assets/ for minimal JS bundles
```

### 2. Islands Architecture ✅

**Status:** IMPLEMENTED

Only hydrate components that need interactivity using `client:*` directives.

**Implementation:**

- No `client:*` directives used (all components are server-only)
- Client scripts loaded only where needed (FontAwesome, navigation toggle)
- View Transitions API used for smooth navigation without full page reloads

**Best Practice:**

```astro
<!-- ❌ BAD: Unnecessary client-side rendering -->
<Component client:load />

<!-- ✅ GOOD: Server-only component (default) -->
<Component />

<!-- ✅ GOOD: Client-side only when needed -->
<InteractiveWidget client:idle />
```

### 3. Image Optimization ✅

**Status:** IMPLEMENTED

**Configuration (astro.config.mjs):**

```javascript
export default defineConfig({
  image: {
    domains: [
      'avatars.githubusercontent.com',
      'images.amazon.com',
      'ben.balter.com',
      'user-images.githubusercontent.com',
    ],
  },
});
```

**Build Output:**

```
generating optimized images
  ▶ /assets/headshot.Dj042lO9_22DPWL.webp (before: 2869kB, after: 12kB)
```

**Best Practice:**

- Always specify image dimensions
- Use WebP format for modern browsers
- Lazy load images below the fold
- Provide descriptive alt text

### 4. Resource Hints 🔄

**Status:** PARTIALLY IMPLEMENTED

**Current Implementation (BaseLayout.astro):**

```astro
<!-- Preconnect to critical external domains -->
<link rel="preconnect" href="https://avatars.githubusercontent.com" crossorigin />
<link rel="preconnect" href="https://github.com" crossorigin />

<!-- DNS Prefetch for other resources -->
<link rel="dns-prefetch" href="https://images.amazon.com" />
<link rel="dns-prefetch" href="https://user-images.githubusercontent.com" />

<!-- Preload hero image on homepage -->
{hero && <link rel="preload" href="/assets/img/header.jpg" as="image" fetchpriority="high" />}
```

**TODO:**

- [ ] Add font preloading for critical fonts
- [ ] Preload critical CSS
- [ ] Add modulepreload for critical JavaScript

### 5. Bundle Size Optimization 📋

**Status:** TODO

**Actions Needed:**

- [ ] Analyze bundle sizes with `astro build --experimental-static-build`
- [ ] Check for duplicate dependencies
- [ ] Optimize third-party imports (FontAwesome, Bootstrap)
- [ ] Use tree-shaking where possible

**Commands:**

```bash
# Build and analyze
npm run astro:build

# Check bundle sizes
du -sh dist-astro/assets/*.js
du -sh dist-astro/assets/*.css
```

### 6. View Transitions ✅

**Status:** IMPLEMENTED

**Implementation (BaseLayout.astro):**

```astro
import { ClientRouter } from 'astro:transitions';

<head>
  <ClientRouter />
</head>
```

**Benefits:**

- Smooth page navigation without full reloads
- Reduced server load (assets cached)
- App-like user experience
- Native browser API with progressive enhancement

---

## SEO Best Practices

### 1. Semantic HTML ✅

**Status:** IMPLEMENTED

**Structure:**

```html
<!DOCTYPE html>
<html lang="en">
  <head>...</head>
  <body>
    <a href="#content" class="skip-to-content">Skip to main content</a>
    <nav>...</nav>
    <main id="content" role="main">
      <article>
        <header>
          <h1>...</h1>
        </header>
        <div class="post-content">...</div>
        <footer>...</footer>
      </article>
    </main>
    <footer>...</footer>
  </body>
</html>
```

**Elements Used:**

- `<nav>` for navigation
- `<main>` for primary content
- `<article>` for blog posts
- `<header>` and `<footer>` for sectioning
- `<aside>` for related content

### 2. Meta Tags ✅

**Status:** IMPLEMENTED (via astro-seo)

**Implementation (BaseLayout.astro):**

```astro
import { SEO } from 'astro-seo';

<SEO
  title={fullTitle}
  description={description}
  canonical={canonicalUrl}
  openGraph={{...}}
  twitter={{...}}
  extend={{
    meta: [
      { name: 'generator', content: Astro.generator },
      { name: 'author', content: author },
      { name: 'keywords', content: keywords.join(', ') },
      { name: 'color-scheme', content: 'light dark' },
    ],
  }}
/>
```

**Required Meta Tags:**

- ✅ Title (unique per page)
- ✅ Description (150-160 characters)
- ✅ Canonical URL
- ✅ Open Graph tags (og:title, og:description, og:image, og:url)
- ✅ Twitter Card tags
- ✅ Generator tag
- ✅ Author tag
- ✅ Viewport tag

### 3. Structured Data (JSON-LD) ✅

**Status:** IMPLEMENTED

**Schemas Used:**

- **Person** (author information)
- **WebSite** (site information)
- **BlogPosting** (blog posts)
- **BreadcrumbList** (navigation breadcrumbs)

**Implementation (src/utils/structured-data.ts):**

```typescript
export function generatePersonSchema(): Person { ... }
export function generateWebSiteSchema(): WebSite { ... }
export function generateBlogPostingSchema(props): BlogPosting { ... }
export function generateBreadcrumbSchema(items): BreadcrumbList { ... }
```

**Usage (BaseLayout.astro):**

```astro
const schemas = [personSchema, websiteSchema, breadcrumbSchema];
<script type="application/ld+json" set:html={schemaToJsonLd(schemas)} is:inline></script>
```

### 4. Sitemap Generation ✅

**Status:** IMPLEMENTED (@astrojs/sitemap)

**Configuration (astro.config.mjs):**

```javascript
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://ben.balter.com',
  integrations: [
    sitemap({
      filter: (page) => !EXCLUDED_PAGES.some(pattern => page.includes(pattern)),
      serialize: (item) => {
        // Custom priority and changefreq
        return { ...item, priority, changefreq };
      },
    }),
  ],
});
```

**Output:**

- `sitemap-index.xml` - Main sitemap index
- Individual sitemaps for posts, pages

### 5. Clean URLs ✅

**Status:** IMPLEMENTED

**URL Structure:**

- Blog posts: `/YYYY/MM/DD/slug/` (matches Jekyll exactly)
- Static pages: `/page-name/` (trailing slash)
- Feeds: `/feed.xml`, `/press/feed/index.xml`

**Configuration:**

```javascript
export default defineConfig({
  trailingSlash: 'always',
  build: {
    format: 'directory', // Creates /about/index.html not /about.html
  },
});
```

### 6. Image Alt Text ✅

**Status:** ENFORCED

**Best Practice:**

```astro
<!-- ❌ BAD: Missing alt text -->
<img src="/image.jpg" />

<!-- ✅ GOOD: Descriptive alt text -->
<img src="/image.jpg" alt="Ben Balter speaking at a conference" />

<!-- ✅ GOOD: Decorative image -->
<img src="/icon.png" alt="" role="presentation" />
```

### 7. Robots.txt 📋

**Status:** EXISTS (needs optimization)

**Current Location:** `public/robots.txt`

**TODO:**

- [ ] Review and optimize robots.txt rules
- [ ] Add specific crawl directives
- [ ] Add sitemap reference

---

## Accessibility Best Practices

### 1. Skip to Main Content ✅

**Status:** IMPLEMENTED

**Implementation (BaseLayout.astro):**

```astro
<a href="#content" class="skip-to-content visually-hidden-focusable">
  Skip to main content
</a>
<main id="content" role="main" tabindex="-1">
  <slot />
</main>
```

**Why:** Allows keyboard users to bypass navigation and jump directly to content.

### 2. Keyboard Navigation 📋

**Status:** NEEDS TESTING

**Requirements:**

- [ ] All interactive elements accessible via Tab key
- [ ] Logical tab order
- [ ] Visible focus indicators
- [ ] No keyboard traps

**Testing:**

```bash
# Run accessibility tests
npm run test:e2e -- e2e/accessibility.spec.ts
```

### 3. ARIA Attributes ✅

**Status:** PARTIALLY IMPLEMENTED

**Current Usage:**

```astro
<!-- Navigation -->
<nav role="navigation" aria-label="Main navigation">

<!-- Main content -->
<main id="content" role="main" tabindex="-1">

<!-- Links -->
<a href="..." aria-label="View revision history">Edit</a>
```

**TODO:**

- [ ] Audit all interactive components for ARIA labels
- [ ] Add aria-current for active navigation items
- [ ] Add aria-expanded for collapsible elements

### 4. Color Contrast 📋

**Status:** NEEDS VALIDATION

**Requirements:**

- WCAG AA: 4.5:1 for normal text, 3:1 for large text
- WCAG AAA: 7:1 for normal text, 4.5:1 for large text

**TODO:**

- [ ] Run automated contrast checking
- [ ] Fix any contrast issues
- [ ] Add contrast validation to CI

**Tools:**

- axe DevTools
- Lighthouse accessibility audit
- WAVE browser extension

### 5. Focus Management ✅

**Status:** IMPLEMENTED

**Implementation:**

```astro
<!-- Main content can receive focus -->
<main id="content" role="main" tabindex="-1">

<!-- Visible focus styles in CSS -->
<style>
  a:focus, button:focus {
    outline: 2px solid var(--bs-primary);
    outline-offset: 2px;
  }
</style>
```

### 6. Semantic Form Labels 📋

**Status:** N/A (no forms currently)

**Best Practice (for future reference):**

```astro
<label for="email">Email Address</label>
<input type="email" id="email" name="email" required />
```

---

## Build Optimization

### 1. Build Caching 📋

**Status:** TODO

**Actions:**

```javascript
// astro.config.mjs
export default defineConfig({
  experimental: {
    contentCollectionCache: true,
  },
});
```

### 2. Chunk Splitting ✅

**Status:** IMPLEMENTED

**Configuration (astro.config.mjs):**

```javascript
vite: {
  build: {
    rollupOptions: {
      output: {
        assetFileNames: (assetInfo) => {
          // Custom naming for shared CSS bundles
          if (assetInfo.name.endsWith('.css')) {
            return 'assets/global.[hash].css';
          }
          return 'assets/[name].[hash][extname]';
        },
      },
    },
  },
}
```

### 3. Bundle Analysis 📋

**Status:** TODO

**Commands:**

```bash
# Build and check sizes
npm run astro:build
du -sh dist-astro/assets/*

# Analyze bundle composition
npx vite-bundle-visualizer dist-astro/assets
```

---

## Component Architecture

### 1. Server Components First ✅

**Status:** IMPLEMENTED

**Best Practice:**

```astro
<!-- ✅ GOOD: Default server component -->
---
const data = await fetchData();
---
<div>{data}</div>

<!-- ❌ BAD: Unnecessary client component -->
---
import { useState } from 'react';
---
<div client:load>Static content</div>
```

### 2. Minimal Client Components ✅

**Status:** IMPLEMENTED (2 components only)

**Current Client Components:**

1. Navigation (uses `usePathname` hook for active state)
2. FontAwesome/navToggle scripts (client-side initialization)

**Rule:** Only use `client:*` directives when absolutely necessary:

- React hooks (useState, useEffect, etc.)
- Browser APIs (window, document, localStorage)
- Event handlers with state
- Third-party libraries requiring browser environment

### 3. Component Organization ✅

**Status:** IMPLEMENTED

**Structure:**

```
src/
├── components/     # Reusable components
├── layouts/        # Page layouts
├── pages/          # Route components
├── utils/          # Utility functions
└── styles/         # Global styles
```

---

## Testing Strategy

### 1. E2E Tests ✅

**Status:** CONFIGURED (Playwright)

**Test Files:**

- `e2e/homepage.spec.ts` - Homepage functionality
- `e2e/seo.spec.ts` - SEO meta tags
- `e2e/accessibility.spec.ts` - Accessibility standards
- `e2e/performance.spec.ts` - Performance metrics
- `e2e/navigation.spec.ts` - Navigation functionality

**Run Tests:**

```bash
npm run test:e2e:astro
```

### 2. Performance Tests 📋

**Status:** TODO

**Metrics to Test:**

- Largest Contentful Paint (LCP) < 2.5s
- First Input Delay (FID) < 100ms
- Cumulative Layout Shift (CLS) < 0.1
- Time to First Byte (TTFB) < 600ms

**Implementation Needed:**

```typescript
// e2e/performance-astro.spec.ts
test('homepage loads fast', async ({ page }) => {
  const start = Date.now();
  await page.goto('/');
  const lcp = await page.evaluate(() => {
    return new Promise((resolve) => {
      new PerformanceObserver((list) => {
        const entries = list.getEntries();
        const lastEntry = entries[entries.length - 1];
        resolve(lastEntry.renderTime || lastEntry.loadTime);
      }).observe({ entryTypes: ['largest-contentful-paint'] });
    });
  });
  expect(lcp).toBeLessThan(2500);
});
```

### 3. Accessibility Tests 📋

**Status:** PARTIALLY IMPLEMENTED

**TODO:**

- [ ] Automated axe-core tests
- [ ] Keyboard navigation tests
- [ ] Screen reader compatibility tests
- [ ] Color contrast validation

**Implementation:**

```typescript
// e2e/accessibility-astro.spec.ts
import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

test('homepage should not have accessibility violations', async ({ page }) => {
  await page.goto('/');
  const results = await new AxeBuilder({ page }).analyze();
  expect(results.violations).toEqual([]);
});
```

### 4. SEO Validation 📋

**Status:** TODO

**Checks Needed:**

- [ ] All pages have unique titles
- [ ] All pages have descriptions (150-160 chars)
- [ ] All images have alt text
- [ ] Proper heading hierarchy (H1 → H2 → H3)
- [ ] Canonical URLs present
- [ ] Open Graph tags complete

---

## Implementation Checklist

### High Priority (Performance)

- [x] Zero-JavaScript by default
- [x] Islands Architecture
- [x] Image optimization
- [x] View Transitions API
- [ ] Font preloading
- [ ] Critical CSS optimization
- [ ] Bundle size analysis
- [ ] Performance monitoring script

### High Priority (SEO)

- [x] Semantic HTML structure
- [x] Meta tags (via astro-seo)
- [x] Structured data (JSON-LD)
- [x] Sitemap generation
- [x] Clean URLs
- [x] Image alt text
- [ ] Meta description validation script
- [ ] Robots.txt optimization

### High Priority (Accessibility)

- [x] Skip to main content link
- [x] Semantic elements
- [x] ARIA labels on critical elements
- [x] Focus management
- [ ] Keyboard navigation testing
- [ ] Color contrast validation
- [ ] Comprehensive ARIA audit
- [ ] Screen reader testing

### Medium Priority (Build)

- [ ] Enable build caching
- [x] Chunk splitting optimization
- [ ] Bundle size analysis
- [ ] Build performance metrics

### Medium Priority (Testing)

- [x] Playwright E2E configured
- [ ] Performance tests (LCP, FID, CLS)
- [ ] Accessibility audit tests (axe-core)
- [ ] SEO validation tests
- [ ] Visual regression tests

### Low Priority (Nice-to-Have)

- [ ] Service worker for offline support
- [ ] Web app manifest enhancements
- [ ] Progressive Web App (PWA) features
- [ ] Advanced caching strategies

---

## Resources

### Official Documentation

- [Astro Documentation](https://docs.astro.build)
- [Astro Performance Guide](https://docs.astro.build/en/concepts/why-astro/#performance)
- [Astro SEO](https://github.com/jonasmerlin/astro-seo)

### Tools

- [Lighthouse](https://developers.google.com/web/tools/lighthouse)
- [axe DevTools](https://www.deque.com/axe/devtools/)
- [WebPageTest](https://www.webpagetest.org/)
- [PageSpeed Insights](https://pagespeed.web.dev/)

### Best Practices References

- [Web.dev Performance](https://web.dev/performance/)
- [WCAG Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)
- [Core Web Vitals](https://web.dev/vitals/)

---

## Maintenance

This document should be updated whenever:

- Astro version is upgraded
- New best practices emerge
- Performance benchmarks change
- Accessibility standards evolve
- Build process is modified

**Next Review Date:** March 2025

---

**Document Version:** 1.0  
**Last Updated:** December 10, 2024  
**Maintainer:** GitHub Copilot
