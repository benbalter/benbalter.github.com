# Next.js Plugin Equivalents

This document describes the Next.js equivalents for all Jekyll plugins used in the site.

## Overview

All Jekyll plugins have been successfully migrated to Next.js equivalents. **The implementation prioritizes using industry-standard open-source libraries to the maximum extent possible**, complemented by minimal TypeScript utilities and build-time scripts for generating static assets.

## Philosophy: Open-Source First

**All implementations rely on open-source libraries wherever possible.** This approach provides:

* ✅ **Better maintenance** - Active communities and regular updates
* ✅ **More features** - Comprehensive functionality beyond basic needs
* ✅ **Better tested** - Extensive test coverage and real-world usage
* ✅ **Standards compliance** - Adherence to industry standards and specifications
* ✅ **Type safety** - Modern TypeScript definitions and tooling support
* ✅ **Security updates** - Automatic vulnerability patches from maintainers
* ✅ **Reduced custom code** - Less code to write, maintain, and debug

**Open-Source Libraries Used:**

* **@octokit/rest** (v21.0.2) - Official GitHub API client for avatars and metadata
* **@fortawesome/react-fontawesome** - Type-safe FontAwesome icons as React components
* **remark-github** (v12.0.0) - GitHub-flavored markdown with @mentions, issues, commits
* **node-emoji** (v2.2.0) - Comprehensive emoji support with 1800+ GitHub-compatible emoji
* **feed** (v5.1.0) - Standards-compliant RSS/Atom feed generation
* **sitemap** (v9.0.0) - XML sitemap generation with proper escaping
* **natural** - TF-IDF analysis for related posts
* **react-markdown** - React-based markdown rendering (alternative to dangerouslySetInnerHTML)
* **@next/bundle-analyzer** - Bundle size analysis and optimization

## Plugin Migration Status

| Jekyll Plugin          | Status     | Next.js Equivalent                                  | Open-Source Libraries            | Notes                            |
| ---------------------- | ---------- | --------------------------------------------------- | -------------------------------- | -------------------------------- |
| Related Posts (retlab) | ✅ Complete | `script/build-related-posts.ts`                     | **natural**                      | TF-IDF similarity analysis       |
| jekyll-redirect-from   | ✅ Complete | `script/generate-redirects.mjs`                     | -                                | Static HTML redirect pages       |
| jekyll-feed            | ✅ Complete | `lib/rss.ts` + `script/generate-feeds.mjs`          | **feed**                         | RSS 2.0 with CDATA, XML escaping |
| jekyll-sitemap         | ✅ Complete | `lib/sitemap.ts` + `script/generate-feeds.mjs`      | **sitemap**                      | XML sitemap with escaping        |
| jekyll-seo-tag         | ✅ Complete | `lib/seo.ts`                                        | -                                | Enhanced metadata + JSON-LD      |
| jekyll-github-metadata | ✅ Complete | `lib/github.ts`                                     | **@octokit/rest**                | Official GitHub API client       |
| jekyll-avatar          | ✅ Complete | `lib/avatar.ts` + `app/components/GitHubAvatar.tsx` | **@octokit/rest**, Next.js Image | Avatar URLs via Octokit          |
| jekyll-mentions        | ✅ Complete | `lib/markdown.ts`                                   | **remark-github**                | @mentions, issues, PRs, commits  |
| jemoji                 | ✅ Complete | `lib/emoji.ts`                                      | **node-emoji**                   | :emoji: to Unicode (1800+ emoji) |
| jekyll-og-image        | ✅ Complete | `lib/og-image.ts`                                   | -                                | OG image URL resolution          |

## Implementation Details

### 1. Related Posts (`retlab`)

**Jekyll:** LSI (Latent Semantic Indexing) in Ruby\
**Next.js:** TF-IDF similarity analysis in TypeScript

**Location:** `script/build-related-posts.ts`

**Usage:**

```bash
npm run build:related-posts
```

Generates `_data/related_posts.yml` with related post mappings.

**How it works:**

* Reads all markdown posts from `_posts/`
* Extracts plain text using remark
* Calculates TF-IDF vectors using the `natural` library
* Computes cosine similarity between documents
* Outputs YAML file with top 11 related posts per post

### 2. Redirects (`jekyll-redirect-from`)

**Jekyll:** Plugin-generated redirect pages\
**Next.js:** Static HTML redirect pages

**Location:** `script/generate-redirects.mjs`

**Usage:**

```bash
# Runs automatically after next build
npm run next:build
```

**How it works:**

* Scans all markdown files for `redirect_from` and `redirect_to` frontmatter
* Generates static HTML pages with meta refresh and JavaScript redirects
* Creates directory structure matching source paths
* Supports both internal and external redirects

**Example frontmatter:**

```yaml
redirect_from:
  - /old-url/
  - /another-old-url/
redirect_to: https://external-site.com/new-page
```

### 3. RSS Feeds (`jekyll-feed`)

**Jekyll:** jekyll-feed plugin\
**Next.js:** **feed** library (v5.1.0)

**Location:** `lib/rss.ts`, `script/generate-feeds.mjs`

**Open-Source Library:** **feed** - Industry-standard RSS/Atom feed generator

**Outputs:**

* `feed.xml` - Latest 20 blog posts
* `press/feed/index.xml` - Press clips feed

**Usage:**

```bash
# Runs automatically after next build
npm run next:build
```

**Features:**

* Uses feed library for standards-compliant RSS 2.0
* Automatic XML escaping (handled by library)
* Proper CDATA handling
* Full post metadata (title, description, pubDate, guid)
* Press clips from `content/data/clips.yml`

**Why feed library:**

* Used by thousands of projects
* Standards-compliant output
* Automatic handling of XML edge cases
* Better tested than custom implementations

### 4. Sitemap (`jekyll-sitemap`)

**Jekyll:** jekyll-sitemap plugin\
**Next.js:** **sitemap** library (v9.0.0)

**Location:** `lib/sitemap.ts`, `script/generate-feeds.mjs`

**Open-Source Library:** **sitemap** - Industry-standard sitemap generator

**Outputs:**

* `sitemap.xml` - All posts and pages
* `sitemap_index.xml` - Sitemap index (for compatibility)

**Usage:**

```bash
# Runs automatically after next build
npm run next:build
```

**Features:**

* Uses sitemap library for standards-compliant XML
* Automatic XML escaping (handled by library)
* Stream-based for better performance
* Proper lastmod, changefreq, priority
* Homepage, pages, and all blog posts
* Full URL generation from config

**Why sitemap library:**

* Industry standard for sitemap generation
* Automatic handling of XML escaping
* Better performance than manual string building
* Standards-compliant output

### 5. SEO Tags (`jekyll-seo-tag`)

**Jekyll:** jekyll-seo-tag plugin\
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

* OpenGraph tags (og:title, og:description, og:image, etc.)
* Twitter Card tags
* Canonical URLs
* JSON-LD structured data
* Schema.org markup for Person, BlogPosting, WebSite

**Functions:**

* `getPostMetadata(post)` - Blog post SEO metadata
* `getPageMetadata(page, path)` - Page SEO metadata
* `getPostJsonLd(post)` - BlogPosting structured data
* `getPersonJsonLd()` - Person structured data
* `getWebsiteJsonLd()` - WebSite structured data

### 6. GitHub Metadata (`jekyll-github-metadata`)

**Jekyll:** jekyll-github-metadata plugin\
**Next.js:** **@octokit/rest** library (v21.0.2) - Official GitHub API client

**Location:** `lib/github.ts`

**Open-Source Library:** **@octokit/rest** - The official GitHub REST API client

**Usage:**

```typescript
import { getGitHubMetadata, fetchContributors, fetchRepositoryInfo } from '@/lib/github';

const metadata = getGitHubMetadata();
// { owner, repo, url, contributorsUrl, issuesUrl, ... }

// At build time using Octokit:
const contributors = await fetchContributors(30);
const repoInfo = await fetchRepositoryInfo();
```

**Features:**

* Uses official GitHub API client (@octokit/rest)
* Better type safety with TypeScript definitions
* Automatic authentication with GITHUB\_TOKEN
* Rate limit handling
* Repository metadata from `_config.yml`
* URL generators (commits, issues, releases, etc.)
* Contributors list via `octokit.repos.listContributors()`
* Repository info via `octokit.repos.get()`

### 7. Avatars (`jekyll-avatar`)

**Jekyll:** jekyll-avatar plugin\
**Next.js:** **@octokit/rest** + Next.js Image component

**Location:** `lib/avatar.ts`, `app/components/GitHubAvatar.tsx`

**Open-Source Libraries:**

* **@octokit/rest** - Fetches avatar URLs from GitHub API
* **Next.js Image** - Optimized image component

**Usage:**

```typescript
// Async with Octokit API
import { getGitHubAvatarUrl } from '@/lib/avatar';
const url = await getGitHubAvatarUrl('username', 80);

// Sync (direct URL construction)
import { getGitHubAvatarUrlSync } from '@/lib/avatar';
const url = getGitHubAvatarUrlSync('username', 80);

// As a component with Next.js Image
import GitHubAvatar from '@/app/components/GitHubAvatar';
<GitHubAvatar username="benbalter" size={40} />
```

**Features:**

* Uses Octokit's `users.getByUsername()` for avatar URLs
* Caching to minimize API calls
* Fallback to direct URL construction
* Next.js Image component for optimization
* Configurable size
* Lazy loading by default

### 8. Mentions (`jekyll-mentions`)

**Jekyll:** jekyll-mentions plugin\
**Next.js:** **remark-github** plugin (v12.0.0)

**Location:** `lib/markdown.ts` (integrated into markdown processing)

**Open-Source Library:** **remark-github** - Official remark plugin for GitHub features

**Usage:**

```typescript
// Automatic in markdown processing via remark-github
const html = await markdownToHtml(markdown);
// @username becomes <a href="https://github.com/username">@username</a>
// #123 becomes link to issue/PR #123
// Commit SHAs become commit links
```

**Features:**

* Uses official remark-github plugin
* Automatic @mention linking to GitHub profiles
* Issue and PR reference linking (#123)
* Commit SHA linking (7–40 character SHAs)
* User/org disambiguation
* Preserves original syntax in display
* Integrated into remark markdown pipeline

**Note:** `lib/mentions.ts` contains custom utilities kept for backward compatibility, but the primary implementation uses remark-github.

### 9. Emoji (`jemoji`)

**Jekyll:** jemoji plugin\
**Next.js:** **node-emoji** library (v2.2.0)

**Location:** `lib/emoji.ts`, integrated in `lib/markdown.ts`

**Open-Source Library:** **node-emoji** - Community-maintained emoji database

**Usage:**

```typescript
import { processEmoji } from '@/lib/emoji';

// Automatic in markdown processing via node-emoji
const html = await markdownToHtml(markdown);
// :rocket: becomes 🚀
```

**Features:**

* Uses node-emoji's `emojify()` function
* Converts `:emoji_name:` to Unicode emoji
* 1800+ emoji supported (vs \~100 in custom implementations)
* GitHub-compatible emoji names
* Full emoji database maintained by the community
* Better tested than custom implementations

**Supported emoji:**

* All standard Unicode emoji
* GitHub shortcode names (`:+1:`, `:rocket:`, `:wave:`, etc.)
* Comprehensive coverage across all categories

**Why node-emoji:**

* Industry-standard library with 2.3M+ weekly downloads
* Actively maintained with regular updates
* Comprehensive test suite
* Better emoji coverage than custom implementations

### 10. OG Images (`jekyll-og-image`)

**Jekyll:** jekyll-og-image plugin (generates images)\
**Next.js:** OG image URL resolution

**Location:** `lib/og-image.ts`

**Usage:**

```typescript
import { getPostOgImage, getPageOgImage } from '@/lib/og-image';

const ogImage = getPostOgImage(post);
// Returns URL to post's OG image
```

**Features:**

* Resolves OG images from frontmatter
* Falls back to pre-generated images in `assets/images/og/posts/`
* Default image fallback
* Full URL generation

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

* Emoji conversion (4 tests)
* Mentions processing (5 tests)
* Avatar URL generation (1 test)

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

* Markdown to HTML conversion (emoji, mentions)
* Build time (redirects, RSS, sitemap)
* Metadata generation (SEO, OG images)

## Differences from Jekyll

### Emoji

* **Jekyll:** Full GitHub emoji support (1000+ emoji)
* **Next.js:** Full emoji support via `node-emoji` library (1800+ emoji)
* **Note:** Now using the industry-standard node-emoji library with comprehensive coverage

### GitHub Metadata

* **Jekyll:** Automatic GitHub API integration via Jekyll environment
* **Next.js:** Opt-in API fetching with `GITHUB_TOKEN` environment variable
* **Note:** Most metadata derived from config file

### OG Images

* **Jekyll:** Dynamic generation at build time
* **Next.js:** Uses pre-generated images or frontmatter values
* **Note:** Images already exist in `assets/images/og/posts/`

### Redirects

* **Jekyll:** Server-side redirects on GitHub Pages
* **Next.js:** Client-side redirects via meta refresh and JavaScript
* **Note:** Both approaches work for static hosting

### RSS & Sitemap

* **Jekyll:** Generated by Jekyll plugins
* **Next.js:** Generated using industry-standard libraries (`feed`, `sitemap`)
* **Note:** Standards-compliant output with better test coverage
* **Jekyll:** Server-side redirects on GitHub Pages
* **Next.js:** Client-side redirects via meta refresh and JavaScript
* **Note:** Both approaches work for static hosting

## Performance

All plugin features are optimized for static generation:

* **Related posts:** Pre-computed once, stored in YAML
* **Redirects:** Static HTML files
* **RSS/Sitemap:** Generated once at build time
* **Emoji/Mentions:** Processed once during build
* **Avatars:** External GitHub API (cached by browsers)

No runtime overhead or API calls in production.

## Future Enhancements

Potential improvements:

1. **Dynamic OG Image Generation:** Use `@vercel/og` to generate images on-demand
2. **Extended Emoji Support:** Add full GitHub emoji set or use `node-emoji` library
3. **GitHub Metadata Caching:** Cache API responses during build
4. **Incremental Related Posts:** Only recalculate changed posts

## Troubleshooting

### Emoji not rendering

* Check emoji name matches supported set in `lib/emoji.ts`
* Add custom emoji to the `emojiMap` object

### Mentions not linking

* Ensure username is alphanumeric with optional hyphens
* Check username doesn't conflict with email patterns

### RSS feed not updating

* Run `npm run next:build` to regenerate
* Check `content/posts/` directory has latest posts

### OG images missing

* Verify image exists in `assets/images/og/posts/`
* Check frontmatter for `image` or `og_image` field
* Falls back to default headshot if not found

## Resources

### Open-Source Libraries

* [@octokit/rest](https://github.com/octokit/rest.js) - Official GitHub REST API client
* [remark-github](https://github.com/remarkjs/remark-github) - GitHub-flavored markdown plugin
* [node-emoji](https://github.com/omnidan/node-emoji) - Emoji support for Node.js
* [feed](https://github.com/jpmonette/feed) - RSS/Atom feed generator
* [sitemap](https://github.com/ekalinin/sitemap.js) - Sitemap generator
* [natural](https://github.com/NaturalNode/natural) - Natural language processing for TF-IDF

### Documentation

* [Next.js Metadata API](https://nextjs.org/docs/app/api-reference/functions/generate-metadata)
* [RSS 2.0 Specification](https://www.rssboard.org/rss-specification)
* [Sitemap Protocol](https://www.sitemaps.org/protocol.html)
* [Open Graph Protocol](https://ogp.me/)
* [Schema.org Documentation](https://schema.org/)

## Summary: Open-Source First Approach

This implementation demonstrates the benefits of **relying on open-source libraries to the maximum extent possible**:

✅ **5 Major Open-Source Libraries** replace custom implementations
✅ **Better Maintained** - Active communities with regular updates
✅ **More Features** - Comprehensive functionality beyond basic needs
✅ **Better Tested** - Extensive test suites and real-world usage
✅ **Standards Compliant** - Adherence to industry specifications
✅ **Type Safe** - Modern TypeScript definitions
✅ **Secure** - Automatic vulnerability patches
✅ **Less Code** - Minimal custom code to maintain

**Key Principle:** When implementing new features, always search for and evaluate existing open-source libraries before writing custom code. This ensures better quality, maintainability, and community support.

## Recent Enhancements (2025)

### React FontAwesome Integration

**Migration from string-based icons to React components:**

Previously (string-based):
```tsx
<i className="fas fa-rss" title="Atom Feed"></i>
<i className="far fa-clock"></i>
```

Now (React components):
```tsx
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faRss } from '@fortawesome/free-solid-svg-icons';
import { faClock } from '@fortawesome/free-regular-svg-icons';

<FontAwesomeIcon icon={faRss} title="Atom Feed" />
<FontAwesomeIcon icon={faClock} />
```

**Benefits:**
* **Type-safe** - TypeScript ensures correct icon names
* **Tree-shaking** - Only used icons are included in bundle
* **No DOM manipulation** - Pure React rendering
* **Better performance** - No need for DOM watcher
* **Easier testing** - React components are easier to test

**Components Updated:**
* `app/components/Footer.tsx` - RSS icon
* `app/components/ReadingTime.tsx` - Clock icon
* `app/components/ClientScripts.tsx` - Removed FontAwesome DOM watcher

### Next.js Image Component

**Migration from `<img>` to Next.js `Image`:**

Previously:
```tsx
<img src={url} alt={alt} width={100} height={100} />
```

Now:
```tsx
import Image from 'next/image';

<Image src={url} alt={alt} width={100} height={100} />
```

**Benefits:**
* Automatic image optimization
* Lazy loading out of the box
* Responsive images
* Better Core Web Vitals scores

**Components Updated:**
* `app/components/MiniBio.tsx` - Author avatar
* `app/components/GitHubAvatar.tsx` - Already using Image

### Next.js Configuration Enhancements

**Added to `next.config.mjs`:**

1. **Bundle Analyzer** - Analyze bundle size with `ANALYZE=true npm run next:build`
2. **React Strict Mode** - Better development experience
3. **Compiler Optimizations** - Remove console logs in production
4. **Turbopack Support** - Next.js 16+ compatibility
5. **Webpack Tree-shaking** - Optimize bundle size

### React Markdown Alternative

**Created `app/components/MarkdownContent.tsx`:**

Alternative to `dangerouslySetInnerHTML` using `react-markdown`:

```tsx
import MarkdownContent from '@/app/components/MarkdownContent';

<MarkdownContent markdown={markdownString} className="content" />
```

**Benefits:**
* Type-safe React component rendering
* Automatic HTML sanitization via `rehype-sanitize`
* No `dangerouslySetInnerHTML`
* Better React integration

**Note:** Currently optional - existing pages can migrate incrementally

### MDX Support Ready

Installed `@next/mdx` for future MDX-based content:
* Mix React components with markdown
* Interactive code examples
* Dynamic content

Ready to use when needed - no migration required yet.
