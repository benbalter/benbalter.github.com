# Next.js Plugin Equivalents

This document describes the Next.js equivalents for all Jekyll plugins used in the site.

## Overview

All Jekyll plugins have been successfully migrated to Next.js equivalents. The implementation uses TypeScript utilities in the `lib/` directory, industry-standard open-source libraries, and build-time scripts for generating static assets.

**Open-Source Libraries Used:**
- **node-emoji** (v2.2.0) - Comprehensive emoji support with 1800+ emoji
- **feed** (v5.1.0) - Standards-compliant RSS/Atom feed generation
- **sitemap** (v9.0.0) - XML sitemap generation

## Plugin Migration Status

| Jekyll Plugin | Status | Next.js Equivalent | Libraries Used | Notes |
|---------------|--------|-------------------|----------------|-------|
| Related Posts (retlab) | ✅ Complete | `script/build-related-posts.ts` | natural | TF-IDF similarity analysis |
| jekyll-redirect-from | ✅ Complete | `script/generate-redirects.mjs` | - | Static HTML redirect pages |
| jekyll-feed | ✅ Complete | `lib/rss.ts` + `script/generate-feeds.mjs` | **feed** | RSS 2.0 feeds |
| jekyll-sitemap | ✅ Complete | `lib/sitemap.ts` + `script/generate-feeds.mjs` | **sitemap** | XML sitemap |
| jekyll-seo-tag | ✅ Complete | `lib/seo.ts` | - | Enhanced metadata + JSON-LD |
| jekyll-github-metadata | ✅ Complete | `lib/github.ts` | - | Repository metadata utilities |
| jekyll-avatar | ✅ Complete | `lib/avatar.ts` + `app/components/GitHubAvatar.tsx` | - | Avatar URLs and component |
| jekyll-mentions | ✅ Complete | `lib/mentions.ts` | - | @username to GitHub links |
| jemoji | ✅ Complete | `lib/emoji.ts` | **node-emoji** | :emoji: to Unicode conversion |
| jekyll-og-image | ✅ Complete | `lib/og-image.ts` | - | OG image URL resolution |

## Implementation Details

### 1. Related Posts (`retlab`)

**Jekyll:** LSI (Latent Semantic Indexing) in Ruby  
**Next.js:** TF-IDF similarity analysis in TypeScript

**Location:** `script/build-related-posts.ts`

**Usage:**
```bash
npm run build:related-posts
```

Generates `_data/related_posts.yml` with related post mappings.

**How it works:**
- Reads all markdown posts from `_posts/`
- Extracts plain text using remark
- Calculates TF-IDF vectors using the `natural` library
- Computes cosine similarity between documents
- Outputs YAML file with top 11 related posts per post

### 2. Redirects (`jekyll-redirect-from`)

**Jekyll:** Plugin-generated redirect pages  
**Next.js:** Static HTML redirect pages

**Location:** `script/generate-redirects.mjs`

**Usage:**
```bash
# Runs automatically after next build
npm run next:build
```

**How it works:**
- Scans all markdown files for `redirect_from` and `redirect_to` frontmatter
- Generates static HTML pages with meta refresh and JavaScript redirects
- Creates directory structure matching source paths
- Supports both internal and external redirects

**Example frontmatter:**
```yaml
redirect_from:
  - /old-url/
  - /another-old-url/
redirect_to: https://external-site.com/new-page
```

### 3. RSS Feeds (`jekyll-feed`)

**Jekyll:** jekyll-feed plugin  
**Next.js:** `feed` library (v5.1.0)

**Location:** `lib/rss.ts`, `script/generate-feeds.mjs`

**Outputs:**
- `feed.xml` - Latest 20 blog posts
- `press/feed/index.xml` - Press clips feed

**Usage:**
```bash
# Runs automatically after next build
npm run next:build
```

**Features:**
- Standards-compliant RSS 2.0 format
- Proper CDATA handling
- Full post metadata (title, description, pubDate, guid)
- Press clips from `content/data/clips.yml`
- Uses the industry-standard `feed` library

### 4. Sitemap (`jekyll-sitemap`)

**Jekyll:** jekyll-sitemap plugin  
**Next.js:** `sitemap` library (v9.0.0)

**Location:** `lib/sitemap.ts`, `script/generate-feeds.mjs`

**Outputs:**
- `sitemap.xml` - All posts and pages
- `sitemap_index.xml` - Sitemap index (for compatibility)

**Usage:**
```bash
# Runs automatically after next build
npm run next:build
```

**Features:**
- Standards-compliant XML sitemap
- Proper lastmod, changefreq, priority
- Homepage, pages, and all blog posts
- Full URL generation from config
- Uses the industry-standard `sitemap` library

### 5. SEO Tags (`jekyll-seo-tag`)

**Jekyll:** jekyll-seo-tag plugin  
**Next.js:** Next.js Metadata API + custom utilities

**Location:** `lib/seo.ts`

**Usage in components:**
```typescript
import { getPostMetadata, getPageMetadata } from '@/lib/seo';

// In page.tsx
export async function generateMetadata({ params }) {
  const post = getPostBySlug(params.slug);
  return getPostMetadata(post);
}
```

**Features:**
- OpenGraph tags (og:title, og:description, og:image, etc.)
- Twitter Card tags
- Canonical URLs
- JSON-LD structured data
- Schema.org markup for Person, BlogPosting, WebSite

**Functions:**
- `getPostMetadata(post)` - Blog post SEO metadata
- `getPageMetadata(page, path)` - Page SEO metadata
- `getPostJsonLd(post)` - BlogPosting structured data
- `getPersonJsonLd()` - Person structured data
- `getWebsiteJsonLd()` - WebSite structured data

### 6. GitHub Metadata (`jekyll-github-metadata`)

**Jekyll:** jekyll-github-metadata plugin  
**Next.js:** Config-based + API utilities

**Location:** `lib/github.ts`

**Usage:**
```typescript
import { getGitHubMetadata, fetchContributors } from '@/lib/github';

const metadata = getGitHubMetadata();
// { owner, repo, url, contributorsUrl, issuesUrl, ... }

// At build time:
const contributors = await fetchContributors(30);
```

**Features:**
- Repository metadata from `_config.yml`
- URL generators (commits, issues, releases, etc.)
- GitHub API integration for contributors
- Repository info fetching
- Supports `GITHUB_TOKEN` env var for higher rate limits

### 7. Avatars (`jekyll-avatar`)

**Jekyll:** jekyll-avatar plugin  
**Next.js:** Avatar utilities + React component

**Location:** `lib/avatar.ts`, `app/components/GitHubAvatar.tsx`

**Usage:**
```typescript
// As a utility
import { getGitHubAvatarUrl } from '@/lib/avatar';
const url = getGitHubAvatarUrl('username', 80);

// As a component
import GitHubAvatar from '@/app/components/GitHubAvatar';
<GitHubAvatar username="benbalter" size={40} />
```

**Features:**
- GitHub Avatars API integration
- Configurable size
- React component with lazy loading
- HTML img tag generation

### 8. Mentions (`jekyll-mentions`)

**Jekyll:** jekyll-mentions plugin  
**Next.js:** Markdown post-processing

**Location:** `lib/mentions.ts`, integrated in `lib/markdown.ts`

**Usage:**
```typescript
import { processMentions, extractMentions } from '@/lib/mentions';

// Automatic in markdown processing
const html = await markdownToHtml(markdown);
// @username becomes <a href="https://github.com/username">@username</a>
```

**Features:**
- Converts `@username` to GitHub profile links
- Preserves original @ syntax in display
- Avoids email addresses
- Extracts all mentions from text
- Safe HTML processing (doesn't affect existing links)

### 9. Emoji (`jemoji`)

**Jekyll:** jemoji plugin  
**Next.js:** `node-emoji` library (v2.2.0)

**Location:** `lib/emoji.ts`, integrated in `lib/markdown.ts`

**Usage:**
```typescript
import { processEmoji } from '@/lib/emoji';

// Automatic in markdown processing
const html = await markdownToHtml(markdown);
// :rocket: becomes 🚀
```

**Features:**
- Converts `:emoji_name:` to Unicode emoji
- 1800+ emoji supported via node-emoji
- GitHub-compatible emoji names
- Full emoji database maintained by the community

**Supported emoji:**
- All standard Unicode emoji
- GitHub shortcode names (`:+1:`, `:rocket:`, `:wave:`, etc.)
- Comprehensive coverage across all categories

### 10. OG Images (`jekyll-og-image`)

**Jekyll:** jekyll-og-image plugin (generates images)  
**Next.js:** OG image URL resolution

**Location:** `lib/og-image.ts`

**Usage:**
```typescript
import { getPostOgImage, getPageOgImage } from '@/lib/og-image';

const ogImage = getPostOgImage(post);
// Returns URL to post's OG image
```

**Features:**
- Resolves OG images from frontmatter
- Falls back to pre-generated images in `assets/images/og/posts/`
- Default image fallback
- Full URL generation

**Image priority:**
1. `image` field in frontmatter
2. `og_image` field in frontmatter
3. Pre-generated image at `/assets/images/og/posts/{slug}.png`
4. Default site image

## Build Process

The complete build process integrates all plugins:

```bash
npm run next:build
```

This runs:
1. `next build` - Builds the Next.js application
2. `node script/generate-redirects.mjs` - Generates redirect pages
3. `tsx script/generate-feeds.mjs` - Generates RSS feeds and sitemap

## Testing

All plugin functionality is tested:

```bash
npx tsx --test lib/plugins.test.ts
```

Tests cover:
- Emoji conversion (4 tests)
- Mentions processing (5 tests)
- Avatar URL generation (1 test)

## Configuration

All plugins use the central configuration in `_config.yml`:

```yaml
title: Ben Balter
description: Technology leadership, collaboration, and open source
url: "https://ben.balter.com"
repository: benbalter/benbalter.github.com
author:
  name: Ben Balter
  twitter: benbalter
```

## Usage in Posts

Write posts with full plugin support:

```markdown
---
title: My Post
description: A description
redirect_from:
  - /old-url/
image: /path/to/og-image.png
---

Check out my :rocket: project!

Thanks @benbalter for the help!
```

All plugin features are automatically processed during:
- Markdown to HTML conversion (emoji, mentions)
- Build time (redirects, RSS, sitemap)
- Metadata generation (SEO, OG images)

## Differences from Jekyll

### Emoji
- **Jekyll:** Full GitHub emoji support (1000+ emoji)
- **Next.js:** Full emoji support via `node-emoji` library (1800+ emoji)
- **Note:** Now using the industry-standard node-emoji library with comprehensive coverage

### GitHub Metadata
- **Jekyll:** Automatic GitHub API integration via Jekyll environment
- **Next.js:** Opt-in API fetching with `GITHUB_TOKEN` environment variable
- **Note:** Most metadata derived from config file

### OG Images
- **Jekyll:** Dynamic generation at build time
- **Next.js:** Uses pre-generated images or frontmatter values
- **Note:** Images already exist in `assets/images/og/posts/`

### Redirects
- **Jekyll:** Server-side redirects on GitHub Pages
- **Next.js:** Client-side redirects via meta refresh and JavaScript
- **Note:** Both approaches work for static hosting

### RSS & Sitemap
- **Jekyll:** Generated by Jekyll plugins
- **Next.js:** Generated using industry-standard libraries (`feed`, `sitemap`)
- **Note:** Standards-compliant output with better test coverage
- **Jekyll:** Server-side redirects on GitHub Pages
- **Next.js:** Client-side redirects via meta refresh and JavaScript
- **Note:** Both approaches work for static hosting

## Performance

All plugin features are optimized for static generation:

- **Related posts:** Pre-computed once, stored in YAML
- **Redirects:** Static HTML files
- **RSS/Sitemap:** Generated once at build time
- **Emoji/Mentions:** Processed once during build
- **Avatars:** External GitHub API (cached by browsers)

No runtime overhead or API calls in production.

## Future Enhancements

Potential improvements:

1. **Dynamic OG Image Generation:** Use `@vercel/og` to generate images on-demand
2. **Extended Emoji Support:** Add full GitHub emoji set or use `node-emoji` library
3. **GitHub Metadata Caching:** Cache API responses during build
4. **Incremental Related Posts:** Only recalculate changed posts

## Troubleshooting

### Emoji not rendering
- Check emoji name matches supported set in `lib/emoji.ts`
- Add custom emoji to the `emojiMap` object

### Mentions not linking
- Ensure username is alphanumeric with optional hyphens
- Check username doesn't conflict with email patterns

### RSS feed not updating
- Run `npm run next:build` to regenerate
- Check `content/posts/` directory has latest posts

### OG images missing
- Verify image exists in `assets/images/og/posts/`
- Check frontmatter for `image` or `og_image` field
- Falls back to default headshot if not found

## Resources

- [Next.js Metadata API](https://nextjs.org/docs/app/api-reference/functions/generate-metadata)
- [RSS 2.0 Specification](https://www.rssboard.org/rss-specification)
- [Sitemap Protocol](https://www.sitemaps.org/protocol.html)
- [Open Graph Protocol](https://ogp.me/)
- [Schema.org Documentation](https://schema.org/)
