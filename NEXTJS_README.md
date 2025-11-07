# Next.js Migration for Blog Posts

This directory contains the Next.js setup for migrating blog posts from Jekyll to Next.js.

## Overview

The blog posts are now rendered by Next.js while the rest of the site remains on Jekyll. This hybrid approach allows for:
- Modern React-based rendering for blog posts
- Static site generation compatible with GitHub Pages
- Gradual migration from Jekyll to Next.js

## Directory Structure

```
app/
├── [year]/[month]/[day]/[slug]/  # Dynamic routes for blog posts
│   └── page.tsx                   # Post page component
├── components/                     # Shared React components
│   ├── Nav.tsx                    # Navigation bar
│   └── Footer.tsx                 # Footer
├── layout.tsx                     # Root layout with HTML structure
└── page.tsx                       # Home page (list of posts)

lib/
└── posts.ts                       # Utilities for reading and parsing blog posts

_posts/                            # Markdown blog posts (source)
```

## Build Process

### Option 1: Next.js Only (Development)

```bash
npm run dev          # Start Next.js dev server on http://localhost:3000
npm run next:build   # Build Next.js static site to out/
```

### Option 2: Hybrid Build (Production)

```bash
npm run build:hybrid  # or script/build-hybrid
```

This script:
1. Builds Next.js posts to `out/`
2. Builds Jekyll site to `_site/` (including everything)
3. Copies Next.js-generated posts over Jekyll's posts in `_site/`
4. Copies Next.js static assets (`_next/`) to `_site/`

The final output in `_site/` combines:
- Next.js-rendered blog posts
- Jekyll-rendered pages (about, contact, etc.)
- Jekyll-generated CSS and JavaScript bundles

## Dependencies

### npm packages
- `next` - Next.js framework
- `react` & `react-dom` - React library
- `gray-matter` - Parse markdown front matter
- `remark` & `remark-html` - Markdown to HTML conversion
- `remark-gfm` - GitHub Flavored Markdown support

### Ruby gems (Jekyll)
- Still required for building non-post pages
- See `Gemfile` for full list

## Post Format

Posts are read from `_posts/` directory with the format:
```
YYYY-MM-DD-slug.md
```

Example:
```markdown
---
title: My Blog Post
description: A short description
---

Post content in markdown...
```

The post will be accessible at:
```
/{year}/{month}/{day}/{slug}/
```

## Styling

Next.js pages reference Jekyll's compiled assets:
- CSS: `/assets/css/style.css`
- JS: `/assets/js/bundle.js`

This ensures consistent styling between Jekyll and Next.js pages.

## Development Workflow

1. **Add a new post**: Create a markdown file in `_posts/` following the naming convention
2. **Preview**: Run `npm run dev` to see changes in real-time
3. **Build**: Run `npm run build:hybrid` to generate the complete site
4. **Deploy**: The `_site/` directory contains the deployable static site

## Migration Status

- ✅ Blog posts migrated to Next.js
- ✅ Post listing page (home)
- ✅ Individual post pages
- ✅ Navigation and footer
- ✅ Styling from Jekyll assets
- ⏳ Jekyll still builds non-post pages (about, contact, resume, etc.)

## Future Considerations

- Migrate additional pages to Next.js as needed
- Add image optimization with Next.js Image component
- Implement client-side navigation with Next.js Link
- Add search functionality
- Migrate Jekyll plugins to Next.js equivalents
