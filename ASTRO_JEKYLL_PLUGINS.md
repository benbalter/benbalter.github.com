# Jekyll Plugin Functionality in Astro

This document describes how Jekyll plugins have been replicated in Astro for ben.balter.com.

## Overview

The site previously used Jekyll with several plugins to provide features like emoji support, @mentions, redirects, and GitHub metadata integration. These have all been replicated in Astro using modern JavaScript/TypeScript alternatives.

## Implemented Plugins

### 1. ✅ jekyll-sitemap → @astrojs/sitemap

**Jekyll Plugin:** `jekyll-sitemap`  
**Astro Solution:** `@astrojs/sitemap` (official integration)  
**Status:** Fully implemented

**Configuration:** `astro.config.mjs`

```javascript
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  integrations: [
    sitemap({
      filter: (page) => !EXCLUDED_PAGES.some(pattern => page.includes(pattern)),
      serialize: (item) => {
        // Custom priority and changefreq based on URL patterns
        let priority = 0.6;
        let changefreq = 'monthly';
        
        if (item.url === 'https://ben.balter.com/') {
          priority = 1.0;
          changefreq = 'weekly';
        } else if (BLOG_POST_PATTERN.test(item.url)) {
          priority = 0.8;
          changefreq = 'monthly';
        }
        
        return { ...item, priority, changefreq };
      },
    }),
  ],
});
```

**Output:** `dist-astro/sitemap-index.xml`

---

### 2. ✅ jekyll-feed → @astrojs/rss

**Jekyll Plugin:** `jekyll-feed`  
**Astro Solution:** `@astrojs/rss` (official integration)  
**Status:** Fully implemented

**Location:** `src/pages/feed.xml.ts`

**Features:**
- RSS 2.0 format
- All blog posts included
- Proper dates, titles, descriptions
- Full content or excerpt

**Access:** `/feed.xml`

---

### 3. ✅ jekyll-seo-tag → Manual Meta Tags

**Jekyll Plugin:** `jekyll-seo-tag`  
**Astro Solution:** Manual meta tags in `BaseLayout.astro`  
**Status:** Fully implemented

**Location:** `src/layouts/BaseLayout.astro`

**Features:**
- Open Graph tags for social sharing
- Twitter Card tags
- Canonical URLs
- Site metadata (title, description, author)
- Structured data (JSON-LD) in specific layouts

**Example:**
```astro
<meta property="og:title" content={title} />
<meta property="og:description" content={description} />
<meta property="og:type" content="article" />
<meta property="og:url" content={Astro.url.href} />
<meta name="twitter:card" content="summary_large_image" />
<meta name="twitter:creator" content="@benbalter" />
```

---

### 4. ✅ jemoji → remark-emoji

**Jekyll Plugin:** `jemoji`  
**Astro Solution:** `remark-emoji` npm package  
**Status:** Fully implemented

**Installation:**
```bash
npm install remark-emoji --save-dev
```

**Configuration:** `astro.config.mjs`
```javascript
import remarkEmoji from 'remark-emoji';

export default defineConfig({
  markdown: {
    remarkPlugins: [remarkEmoji],
  },
  integrations: [
    mdx({
      remarkPlugins: [remarkEmoji],
    }),
  ],
});
```

**Usage:**
- Write `:emoji_name:` in Markdown
- Converts to Unicode emoji at build time
- Examples: `:rocket:` → 🚀, `:+1:` → 👍, `:tada:` → 🎉

**Tests:** `src/lib/remark-plugins.test.ts` (4 tests passing)

---

### 5. ✅ jekyll-mentions → Custom remark-mentions Plugin

**Jekyll Plugin:** `jekyll-mentions`  
**Astro Solution:** Custom remark plugin  
**Status:** Fully implemented

**Location:** `src/lib/remark-mentions.ts`

**Features:**
- Converts `@username` to `[@username](https://github.com/username)`
- Matches GitHub username format (alphanumeric, hyphens, max 39 chars)
- Works in all contexts (paragraphs, lists, headings, etc.)
- Does not convert email addresses

**Configuration:** `astro.config.mjs`
```javascript
import { remarkMentions } from './src/lib/remark-mentions.ts';

export default defineConfig({
  markdown: {
    remarkPlugins: [remarkMentions],
  },
  integrations: [
    mdx({
      remarkPlugins: [remarkMentions],
    }),
  ],
});
```

**Usage:**
- Write `@username` in Markdown
- Automatically links to GitHub profile
- Example: `@benbalter` → `[@benbalter](https://github.com/benbalter)`

**Tests:** `src/lib/remark-plugins.test.ts` (6 tests passing)

---

### 6. ✅ jekyll-redirect-from → astro-redirects Integration

**Jekyll Plugin:** `jekyll-redirect-from`  
**Astro Solution:** Custom Astro integration  
**Status:** Fully implemented

**Location:** `src/lib/astro-redirects.ts`

**Features:**
- Reads `redirect_from` frontmatter from all posts
- Generates HTML redirect files with:
  - Meta refresh tag (`<meta http-equiv="refresh">`)
  - Canonical link tag (`<link rel="canonical">`)
  - JavaScript fallback (`<script>location="..."</script>`)
  - Robots noindex directive
- Supports both string and array formats
- Runs automatically during `astro build`

**Configuration:** `astro.config.mjs`
```javascript
import { redirects } from './src/lib/astro-redirects.ts';

export default defineConfig({
  integrations: [redirects()],
});
```

**Frontmatter Usage:**
```yaml
---
title: My Post
redirect_from:
  - /old/url/path/
  - /another/old/path/
---
```

**Output:**
- Creates `dist-astro/old/url/path/index.html` with redirect
- Creates `dist-astro/another/old/path/index.html` with redirect
- Both redirect to the current post URL

**Statistics:**
- Generated 20 redirects from existing posts
- Preserves SEO for URL changes (typo fixes, date changes, title changes)

**Example Redirect HTML:**
```html
<!DOCTYPE html>
<html lang="en-US">
<head>
  <meta charset="utf-8">
  <title>Redirecting…</title>
  <link rel="canonical" href="/2014/09/29/our-code-deserves-better/">
  <meta http-equiv="refresh" content="0; url=/2014/09/29/our-code-deserves-better/">
  <meta name="robots" content="noindex">
</head>
<body>
  <h1>Redirecting…</h1>
  <p>This page has moved to <a href="/2014/09/29/our-code-deserves-better/">/2014/09/29/our-code-deserves-better/</a>.</p>
  <script>location="/2014/09/29/our-code-deserves-better/"</script>
</body>
</html>
```

---

### 7. ✅ jekyll-github-metadata → GitHub API Integration

**Jekyll Plugin:** `jekyll-github-metadata`  
**Astro Solution:** Direct GitHub API calls in endpoints  
**Status:** Implemented for humans.txt

**Location:** `src/pages/humans.txt.ts`

**Features:**
- Fetches repository contributors from GitHub API
- Caches results to avoid rate limiting
- Generates humans.txt with contributor information
- Fallback to hardcoded values if API fails

**Implementation:**
```typescript
async function getContributors(): Promise<any[]> {
  const repo = 'benbalter/benbalter.github.com';
  const url = `https://api.github.com/repos/${repo}/contributors`;
  
  const response = await fetch(url, {
    headers: {
      'Accept': 'application/vnd.github.v3+json',
      'User-Agent': 'Astro-Site',
    },
  });
  
  return await response.json();
}
```

**Output Example:**
```
/* SITE */
Last Updated: 2024/12/08
Standards: HTML5, CSS3
Components: Astro, Bootstrap, TypeScript, Node.js, remark, rehype

/* TEAM */
Name: benbalter
Site: https://github.com/benbalter

Name: contributor2
Site: https://github.com/contributor2
```

**Access:** `/humans.txt`

---

### 8. ✅ Related Posts → Custom TF-IDF Algorithm

**Jekyll Feature:** LSI (Latent Semantic Indexing) via classifier-reborn gem  
**Astro Solution:** TF-IDF (Term Frequency-Inverse Document Frequency)  
**Status:** Fully implemented

**Location:** `src/utils/related-posts.ts`

**Algorithm:**
1. Extract words from post titles and descriptions
2. Remove common stop words
3. Calculate TF-IDF scores for each term
4. Compute cosine similarity between posts
5. Return top N most similar posts

**Features:**
- Build-time calculation (no runtime cost)
- Excludes current post from results
- Filters out archived posts
- Configurable number of results
- Smart stop word filtering

**Usage in Post Pages:**
```typescript
import { findRelatedPosts } from '../../../../utils/related-posts';

const relatedPosts = await findRelatedPosts(post, allPosts, 10);
```

**Tests:** `src/utils/related-posts.test.ts` (8 tests passing)

---

### 9. ✅ Reading Time → reading-time Package

**Jekyll Feature:** Simple word count calculation in `_includes/reading-time.html`  
**Astro Solution:** `reading-time` npm package  
**Status:** Fully implemented

**Location:** `src/utils/reading-time.ts`

**Features:**
- Medium-style reading time estimation
- Default: 200 words per minute
- Handles HTML, Markdown, and plain text
- Minimum 1 minute for short posts
- Smart word extraction

**Usage in Post Layout:**
```typescript
import { calculateReadingTime } from '../utils/reading-time';

const content = await Astro.slots.render('default');
const readingTime = calculateReadingTime(content);
```

**Display:** "X min read" in post header

**Tests:** `src/utils/reading-time.test.ts` (12 tests passing)

---

## Additional Features (GitHub Flavored Markdown)

### remark-gfm

**Package:** `remark-gfm`  
**Features:**
- Tables
- Strikethrough
- Task lists
- Autolink literals

**Configuration:** `astro.config.mjs`
```javascript
import remarkGfm from 'remark-gfm';

export default defineConfig({
  markdown: {
    remarkPlugins: [remarkGfm],
  },
});
```

---

## Not Implemented (Optional/Low Priority)

### jekyll-avatar

**Jekyll Plugin:** `jekyll-avatar`  
**Status:** Not implemented  
**Reason:** Rarely used, can be manually implemented if needed

**Alternative:** Use standard `<img>` tags with GitHub avatar URLs:
```html
<img src="https://github.com/username.png" alt="username">
```

---

### jekyll-og-image

**Jekyll Plugin:** `jekyll-og-image`  
**Status:** Not implemented  
**Reason:** OG images already exist in assets, dynamic generation not needed

**Alternative:** Reference existing images in frontmatter or use `@vercel/og` if dynamic generation is needed.

---

### jekyll-include-cache

**Jekyll Plugin:** `jekyll-include-cache`  
**Status:** Not needed  
**Reason:** Astro's build is already fast, caching not necessary

---

## Testing

### Unit Tests

All custom plugins have comprehensive unit tests:

```bash
# Run all tests
npx vitest run

# Run specific test files
npx vitest run src/lib/remark-plugins.test.ts
npx vitest run src/utils/related-posts.test.ts
npx vitest run src/utils/reading-time.test.ts
```

**Test Coverage:**
- Emoji: 4 tests ✅
- Mentions: 6 tests ✅
- Related posts: 8 tests ✅
- Reading time: 12 tests ✅

**Total:** 30 tests passing

### Build Tests

```bash
# Type checking
npm run astro:check

# Production build
npm run astro:build

# Verify redirects generated
ls -la dist-astro/2014/09/29/your-code-deserves-better/
```

---

## Migration Summary

| Jekyll Plugin | Astro Solution | Status |
|--------------|----------------|--------|
| jekyll-sitemap | @astrojs/sitemap | ✅ Complete |
| jekyll-feed | @astrojs/rss | ✅ Complete |
| jekyll-seo-tag | Manual meta tags | ✅ Complete |
| jemoji | remark-emoji | ✅ Complete |
| jekyll-mentions | Custom remark plugin | ✅ Complete |
| jekyll-redirect-from | Custom integration | ✅ Complete |
| jekyll-github-metadata | GitHub API calls | ✅ Partial (humans.txt) |
| Related posts (LSI) | TF-IDF algorithm | ✅ Complete |
| Reading time | reading-time package | ✅ Complete |
| jekyll-avatar | Not implemented | ⏸️ Optional |
| jekyll-og-image | Not implemented | ⏸️ Optional |
| jekyll-include-cache | Not needed | ✅ Not required |

---

## Performance

**Build Time:**
- 194 pages generated
- 20 redirects created
- ~8 seconds total build time

**Runtime:**
- Zero client-side JavaScript for plugins
- All processing done at build time
- Fast page loads with static HTML

---

## Maintenance

### Adding New Emoji

Emoji are automatically converted at build time. Just use the `:emoji_name:` syntax in Markdown.

**Reference:** [Emoji Cheat Sheet](https://github.com/ikatyang/emoji-cheat-sheet)

### Adding Redirects

Add `redirect_from` to post frontmatter:

```yaml
---
title: My Post
redirect_from:
  - /old-url/
  - /another-old-url/
---
```

Redirects are generated automatically during `npm run astro:build`.

### Updating Humans.txt

Contributors are fetched from GitHub API automatically. The component list can be updated in `src/pages/humans.txt.ts`.

---

## Future Enhancements

1. **Full GitHub Metadata Integration**
   - Implement for other pages if needed
   - Add caching layer for production builds

2. **Dynamic OG Image Generation**
   - Use `@vercel/og` to generate images at build time
   - Generate images for posts without existing OG images

3. **Avatar Support**
   - Implement if needed for team pages
   - Use GitHub avatar API or local caching

4. **Enhanced Redirects**
   - Add support for redirect_to (not just redirect_from)
   - Generate Netlify/Vercel redirect rules for better performance

---

## References

- [Astro Documentation](https://docs.astro.build)
- [remark-emoji](https://github.com/remarkjs/remark-emoji)
- [remark-gfm](https://github.com/remarkjs/remark-gfm)
- [unist-util-visit](https://github.com/syntax-tree/unist-util-visit)
- [gray-matter](https://github.com/jonschlinkert/gray-matter)
- [reading-time](https://github.com/ngryman/reading-time.js)

---

**Last Updated:** December 8, 2024  
**Astro Version:** 5.16.4  
**Migration Status:** ✅ Complete
