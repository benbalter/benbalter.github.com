# Migration from Jekyll to Next.js

This document outlines the migration of ben.balter.com from Jekyll to Next.js.

## Overview

The site has been modernized from Jekyll to Next.js 16, maintaining all existing content while updating the technology stack.

## What Changed

### Technology Stack

**Before (Jekyll):**
- Jekyll static site generator
- Ruby-based
- Liquid templating
- Jekyll plugins for extended functionality

**After (Next.js):**
- Next.js 16 with App Router
- Node.js/React-based
- TypeScript with TSX templates
- Remark for Markdown processing

### Content Structure

**Maintained:**
- All blog posts remain in `_posts/` directory
- Markdown files for pages remain in root directory
- Front matter format remains compatible
- All content is preserved

**New:**
- `app/` directory - Next.js App Router structure
- `lib/` directory - Utility functions for content processing
- `next.config.js` - Next.js configuration

### URL Structure

**Posts:**
- Format: `/posts/[slug]`
- Generated from `_posts/YYYY-MM-DD-slug.md` files
- Date extracted from filename

**Pages:**
- Format: `/[slug]`
- Generated from `*.md` files in root (about.md, contact.md, etc.)

### Build Process

**Before:**
```bash
bundle exec jekyll build
```

**After:**
```bash
npm run build
```

## Content Types

### Posts (Date-specific content)

Location: `_posts/`
Naming: `YYYY-MM-DD-slug.md`
Count: 184 posts

Example:
```
_posts/2024-01-08-dissenting-voices.md
```

Accessible at: `/posts/dissenting-voices`

### Pages (Non-date content)

Location: Root directory
Format: `slug.md`
Count: 5 pages (about, contact, fine-print, press, talks)

Example:
```
about.md
```

Accessible at: `/about`

## What Was Excluded

As per the requirements, the following were not migrated:
- Resume functionality (`_resume_positions/`)
- Books
- Other custom collections

These can be added in future iterations if needed.

## Development Workflow

### Local Development

```bash
npm run dev
```

Starts the development server at `http://localhost:3000`

### Production Build

```bash
npm run build
```

Creates an optimized production build and exports static HTML to `out/`

### Testing

All 192 pages are pre-rendered at build time:
- 1 home page
- 184 blog posts
- 5 static pages
- 2 system pages (_not-found, 404)

## Benefits of Migration

1. **Modern Stack**: Next.js 16 with latest React features
2. **TypeScript**: Type safety for better developer experience
3. **Performance**: Optimized static generation
4. **Developer Experience**: Hot reload, better error messages
5. **Ecosystem**: Access to modern npm packages
6. **Maintainability**: Simpler dependency management

## File Structure

```
.
├── app/                    # Next.js App Router
│   ├── [slug]/            # Dynamic pages route
│   ├── posts/[slug]/      # Dynamic posts route
│   ├── layout.tsx         # Root layout
│   ├── page.tsx           # Home page
│   └── globals.css        # Global styles
├── lib/                    # Utilities
│   ├── posts.ts           # Post content management
│   ├── pages.ts           # Page content management
│   └── markdown.ts        # Markdown processing
├── _posts/                # Blog post content (unchanged)
├── *.md                   # Page content (unchanged)
└── next.config.js         # Next.js configuration
```

## Backward Compatibility

- All markdown content remains in original locations
- Front matter format is preserved
- URL structure maintains SEO-friendly slugs
- All 184 posts successfully migrated
- All 5 pages successfully migrated
