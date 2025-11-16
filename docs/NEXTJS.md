# Next.js Migration Guide

## Overview

This site has been migrated from Jekyll to Next.js using the App Router and static site generation (SSG). This guide documents the architecture, development workflow, and best practices for working with the Next.js implementation.

## Architecture

### Tech Stack

* **Next.js 16**: Modern React framework with App Router
* **TypeScript**: Type-safe development
* **React 19**: Latest React features including React Server Components
* **Static Export**: Generates static HTML for GitHub Pages hosting
* **Bootstrap 5**: UI framework (via webpack build)
* **Remark/Unified**: Markdown processing with GitHub-flavored Markdown support

### Directory Structure

```
.
├── app/                    # Next.js App Router
│   ├── [slug]/            # Dynamic page routes
│   ├── [year]/[month]/[day]/[slug]/  # Blog post routes
│   ├── components/        # React components
│   ├── layout.tsx         # Root layout
│   ├── page.tsx           # Homepage
│   ├── error.tsx          # Error boundary
│   └── loading.tsx        # Loading UI
├── content/               # Migrated content from Jekyll
│   ├── posts/            # Blog posts (Markdown)
│   ├── pages/            # Static pages
│   ├── data/             # YAML data files
│   └── resume/           # Resume entries
├── lib/                   # Utility libraries
│   ├── posts.ts          # Post loading and processing
│   ├── pages.ts          # Page loading
│   ├── markdown.ts       # Markdown to HTML conversion
│   ├── metadata.ts       # SEO metadata configuration
│   ├── config.ts         # Site configuration (_config.yml)
│   └── ...               # Other utilities
├── public/                # Static assets
├── script/                # Build and utility scripts
│   ├── generate-redirects.mjs  # Generate redirect HTML files
│   └── generate-feeds.mjs      # Generate RSS feeds and sitemap
├── next.config.mjs        # Next.js configuration
└── tsconfig.json          # TypeScript configuration
```

## Development Workflow

### Getting Started

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Start the development server:**
   ```bash
   npm run dev
   ```
   Visit <http://localhost:3000> to see your changes in real-time.

3. **Build for production:**
   ```bash
   npm run next:build
   ```
   Generates static HTML in the `out/` directory.

4. **Preview production build:**
   ```bash
   npm run next:start
   ```

### Available Scripts

* `npm run dev` - Start Next.js development server with hot reload
* `npm run next:build` - Build production site and generate redirects/feeds
* `npm run next:start` - Serve production build locally
* `npm run build:related-posts` - Generate related posts data
* `npm run lint` - Run all linters (JavaScript, JSON, Markdown)
* `npm run test` - Run full test suite
* `npm run test:e2e` - Run Playwright end-to-end tests

## Key Features

### Static Site Generation (SSG)

All pages and blog posts are pre-rendered at build time using Next.js's static export feature:

```typescript
// next.config.mjs
export default {
  output: 'export',  // Generate static HTML
  trailingSlash: true,  // GitHub Pages compatibility
};
```

### Dynamic Routes

Blog posts follow Jekyll's permalink structure (`/YYYY/MM/DD/slug/`):

```typescript
// app/[year]/[month]/[day]/[slug]/page.tsx
export async function generateStaticParams() {
  const posts = getAllPosts();
  return posts.map(post => {
    const [year, month, day, ...rest] = post.slug.split('-');
    return { year, month, day, slug: rest.join('-') };
  });
}
```

### Content Management

Content is stored as Markdown files with YAML frontmatter:

```markdown
---
title: "My Blog Post"
description: "A description of the post"
date: 2024-01-01
---

Post content here...
```

The migration preserves Jekyll compatibility by prefixing Jekyll-specific fields with `_legacy_`:

* `layout` → `_legacy_layout`
* `permalink` → `_legacy_permalink`
* `redirect_from` → `_legacy_redirect_from`

### Redirects

Legacy Jekyll URLs are preserved using static HTML redirect files generated at build time. The `script/generate-redirects.mjs` script reads `redirect_from` and `redirect_to` from frontmatter and creates client-side redirects.

### RSS Feeds

RSS feeds are generated during the build process by `script/generate-feeds.mjs`:

* `/feed.xml` - Main blog feed
* `/press/feed/index.xml` - Press clips feed
* `/sitemap.xml` - XML sitemap

## Best Practices

### 1. React Server Components (RSC)

Use Server Components by default for better performance:

```typescript
// app/[slug]/page.tsx (Server Component - default)
export default async function Page({ params }) {
  const data = await fetchData();  // Can use async/await
  return <div>{data}</div>;
}
```

Only use Client Components when needed (interactivity, browser APIs):

```typescript
'use client';  // Mark as Client Component

export default function InteractiveButton() {
  const [count, setCount] = useState(0);
  return <button onClick={() => setCount(count + 1)}>{count}</button>;
}
```

### 2. Metadata and SEO

Use the centralized metadata configuration from `lib/metadata.ts`:

```typescript
import { getPostMetadata } from '@/lib/metadata';

export async function generateMetadata({ params }) {
  const post = getPost(params.slug);
  return getPostMetadata(post);
}
```

### 3. Error Handling

Use error boundaries for graceful error handling:

* `app/error.tsx` - Root error boundary
* `app/[year]/[month]/[day]/[slug]/error.tsx` - Post-specific errors

### 4. Loading States

Provide loading UI with `loading.tsx` files:

* `app/loading.tsx` - Root loading state
* `app/[year]/[month]/[day]/[slug]/loading.tsx` - Post loading skeleton

### 5. Type Safety

Leverage TypeScript for better code quality:

```typescript
interface Post {
  slug: string;
  title: string;
  description?: string;
  content: string;
  date: string;
}

export function getPost(slug: string): Post | null {
  // Implementation with proper types
}
```

### 6. Performance Optimization

* **React's cache()**: Use for request-level memoization
  ```typescript
  import { cache } from 'react';
  const getCachedPosts = cache(() => getAllPosts());
  ```

* **Remove console logs in production**: Configured in `next.config.mjs`

* **Code splitting**: Automatic with Next.js App Router

* **Static assets**: Optimized and cached by CDN

### 7. Image Optimization

While `next/image` is great for dynamic sites, static export uses unoptimized images:

```typescript
// next.config.mjs
images: {
  unoptimized: true,  // Required for static export
}
```

For production, consider:

* Using responsive images with `srcset`
* Optimizing images before build
* Serving WebP/AVIF formats

## Migration from Jekyll

### Content Migration

Content has been migrated to `content/` directory:

* Blog posts: `_posts/*.md` → `content/posts/*.md`
* Pages: `*.md` → `content/pages/*.md`
* Data: `_data/*.yml` → `content/data/*.yml`

### Liquid Templates

Jekyll's Liquid templates need to be converted to React components:

```liquid
<!-- Jekyll -->
{% include callout.html content="Important note" %}
```

```tsx
// Next.js
<Callout>Important note</Callout>
```

### Jekyll Plugins

Jekyll plugins have Next.js equivalents:

* `jekyll-feed` → `script/generate-feeds.mjs`
* `jekyll-sitemap` → Sitemap generation in feed script
* `jekyll-seo-tag` → `lib/metadata.ts`
* `jekyll-mentions` → `remark-github` plugin
* `jemoji` → Custom emoji processing in `lib/emoji.ts`

## Deployment

### GitHub Pages

The site is configured for GitHub Pages deployment:

1. Build runs on push to main branch
2. Static HTML is generated in `out/` directory
3. GitHub Pages serves the content

### Build Process

```bash
npm run next:build
```

This command:

1. Runs `next build` - Generates static pages
2. Runs `generate-redirects.mjs` - Creates redirect HTML files
3. Runs `generate-feeds.mjs` - Generates RSS feeds and sitemap

## Testing

### Unit Tests

Run TypeScript tests for build scripts:

```bash
npm run test:related-posts
```

### E2E Tests

Playwright tests cover critical user paths:

```bash
npm run test:e2e          # Headless
npm run test:e2e:ui       # UI mode
npm run test:e2e:headed   # Headed mode
```

### Linting

```bash
npm run lint        # All linters
npm run lint-js     # JavaScript/TypeScript
npm run lint-json   # JSON files
npm run lint-md     # Markdown files
```

## Troubleshooting

### Build Failures

If build fails:

1. Check TypeScript errors: `npx tsc --noEmit`
2. Clear Next.js cache: `rm -rf .next`
3. Reinstall dependencies: `rm -rf node_modules && npm install`

### Missing Pages

If a page isn't generating:

1. Check `generateStaticParams()` includes the route
2. Verify content file exists in `content/` directory
3. Check frontmatter has required fields

### Redirect Issues

If redirects aren't working:

1. Check `_legacy_redirect_from` in frontmatter
2. Run redirect generation: `node script/generate-redirects.mjs`
3. Verify HTML files exist in `out/` directory

## Resources

* [Next.js Documentation](https://nextjs.org/docs)
* [App Router Guide](https://nextjs.org/docs/app)
* [Static Exports](https://nextjs.org/docs/app/building-your-application/deploying/static-exports)
* [Metadata API](https://nextjs.org/docs/app/building-your-application/optimizing/metadata)
* [TypeScript in Next.js](https://nextjs.org/docs/app/building-your-application/configuring/typescript)

## Contributing

When contributing to the Next.js codebase:

1. Follow TypeScript best practices
2. Add proper error handling and loading states
3. Use Server Components by default
4. Write tests for new functionality
5. Update documentation as needed
6. Run linters before committing

## License

* Content: [Creative Commons, BY](http://creativecommons.org/licenses/by/3.0/)
* Code: [MIT](http://opensource.org/licenses/mit-license.php)
