# Astro Architecture Design for ben.balter.com

**Date:** December 8, 2024\
**Status:** Design Document\
**Purpose:** Define Astro content organization, routing, and URL structure to match existing Jekyll site

---

## Executive Summary

This document defines the architecture for migrating ben.balter.com from Jekyll to Astro, ensuring:

- **Identical URL structure** - All URLs remain unchanged
- **Content preservation** - All posts, pages, and data migrate successfully
- **Feature parity** - RSS feeds, sitemaps, redirects, and related posts work as expected
- **SEO maintenance** - Meta tags, structured data, and Open Graph images preserved

**Key Design Principle:** Static Site Generation (SSG) first - pre-render all pages at build time.

---

## Table of Contents

1. [Directory Structure](#directory-structure)
2. [Content Organization](#content-organization)
3. [URL Structure and Routing](#url-structure-and-routing)
4. [Frontmatter Specification](#frontmatter-specification)
5. [Data Files and Collections](#data-files-and-collections)
6. [Features Implementation](#features-implementation)
7. [Build Pipeline](#build-pipeline)
8. [Migration Checklist](#migration-checklist)

---

## Directory Structure

```
/
├── src/
│   ├── content/
│   │   ├── config.ts              # Content collections schema
│   │   ├── posts/                 # Blog posts (*.md)
│   │   │   ├── 2010-09-12-wordpress-resume-plugin.md
│   │   │   ├── 2023-05-19-pull-requests-are-form-of-documentation.md
│   │   │   └── ... (184 posts)
│   │   ├── pages/                 # Static pages (*.md)
│   │   │   ├── about.md
│   │   │   ├── resume.md
│   │   │   ├── contact.md
│   │   │   └── ...
│   │   └── resume-positions/      # Resume position entries
│   │       ├── github-director.md
│   │       └── ... (10 positions)
│   ├── data/
│   │   ├── books.yml              # Book recommendations
│   │   ├── clips.yml              # Press mentions
│   │   ├── related-posts.yml      # Generated related posts
│   │   └── site.yml               # Site configuration
│   ├── layouts/
│   │   ├── BaseLayout.astro       # Base HTML structure
│   │   ├── PostLayout.astro       # Blog post layout
│   │   └── PageLayout.astro       # Static page layout
│   ├── components/
│   │   ├── Header.astro
│   │   ├── Footer.astro
│   │   ├── PostCard.astro
│   │   ├── RelatedPosts.astro
│   │   └── ...
│   ├── pages/
│   │   ├── index.astro            # Homepage (blog list)
│   │   ├── [year]/
│   │   │   └── [month]/
│   │   │       └── [day]/
│   │   │           └── [slug].astro  # Blog post pages
│   │   ├── [...slug].astro        # Static pages (catch-all)
│   │   ├── feed.xml.ts            # Main RSS feed
│   │   ├── press-feed.xml.ts      # Press clips feed
│   │   └── sitemap.xml.ts         # XML sitemap (or use @astrojs/sitemap)
│   ├── styles/
│   │   ├── global.css
│   │   └── ...
│   └── utils/
│       ├── posts.ts               # Post utilities
│       ├── urls.ts                # URL generation
│       ├── markdown.ts            # Markdown processing
│       └── redirects.ts           # Redirect handling
├── public/
│   ├── assets/
│   ├── robots.txt
│   ├── humans.txt
│   └── ...
└── astro.config.mjs               # Astro configuration
```

---

## Content Organization

### 1. Blog Posts Collection

**Location:** `src/content/posts/`

**File Naming Convention:**

```
YYYY-MM-DD-title-with-hyphens.md
```

**Examples:**

- `2023-05-19-pull-requests-are-a-form-of-documentation.md`
- `2020-01-17-ten-lessons-learned-fostering-a-community-of-communities-on-github.md`

**Content Collection Schema** (`src/content/config.ts`):

```typescript
import { defineCollection, z } from 'astro:content';

const postsCollection = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    description: z.string(),
    date: z.date().optional(), // Auto-parsed from filename if missing
    redirect_from: z.array(z.string()).optional(),
    comments: z.boolean().default(true),
    permalink: z.string().optional(),
    archived: z.boolean().optional(),
    image: z.string().optional(),
  }),
});

export const collections = {
  posts: postsCollection,
};
```

### 2. Static Pages Collection

**Location:** `src/content/pages/`

**Files:**

- `about.md`
- `resume.md`
- `contact.md`
- `talks.md`
- `press.md`
- `fine-print.md`
- `other-recommended-reading.md`

**Content Collection Schema:**

```typescript
const pagesCollection = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    description: z.string(),
    permalink: z.string().optional(),
    layout: z.string().optional(),
    published: z.boolean().default(true),
    seo: z.object({
      type: z.string().optional(),
    }).optional(),
  }),
});

export const collections = {
  pages: pagesCollection,
};
```

### 3. Resume Positions Collection

**Location:** `src/content/resume-positions/`

**Content Collection Schema:**

```typescript
const resumePositionsCollection = defineCollection({
  type: 'content',
  schema: z.object({
    employer: z.string(),
    title: z.string(),
    start_date: z.string(),
    end_date: z.string().optional(),
  }),
});

export const collections = {
  'resume-positions': resumePositionsCollection,
};
```

---

## URL Structure and Routing

### Blog Post URLs

**Jekyll Pattern:** `/:year/:month/:day/:title/`

**Astro Implementation:** `src/pages/[year]/[month]/[day]/[slug].astro`

**Example URLs:**

```
/2023/05/19/pull-requests-are-a-form-of-documentation/
/2020/01/17/ten-lessons-learned-fostering-a-community-of-communities-on-github/
/2010/09/12/wordpress-resume-plugin/
```

**Dynamic Route Implementation:**

```typescript
// src/pages/[year]/[month]/[day]/[slug].astro
---
import { getCollection } from 'astro:content';
import PostLayout from '@layouts/PostLayout.astro';

export async function getStaticPaths() {
  const posts = await getCollection('posts');
  
  return posts.map(post => {
    // Parse date from filename: YYYY-MM-DD-slug.md
    const filename = post.id;
    const match = filename.match(/^(\d{4})-(\d{2})-(\d{2})-(.+)\.md$/);
    
    if (!match) {
      throw new Error(`Invalid post filename: ${filename}`);
    }
    
    const [, year, month, day, slug] = match;
    
    return {
      params: { year, month, day, slug },
      props: { post },
    };
  });
}

const { post } = Astro.props;
const { Content } = await post.render();
---

<PostLayout frontmatter={post.data}>
  <Content />
</PostLayout>
```

### Static Page URLs

**Jekyll Pattern:** `/page-name/` (from permalink in frontmatter)

**Astro Implementation:** `src/pages/[...slug].astro` (catch-all route)

**Example URLs:**

```
/about/
/resume/
/contact/
/talks/
/press/
```

**Catch-All Route Implementation:**

```typescript
// src/pages/[...slug].astro
---
import { getCollection } from 'astro:content';
import PageLayout from '@layouts/PageLayout.astro';

export async function getStaticPaths() {
  const pages = await getCollection('pages');
  
  return pages.map(page => {
    // Use permalink from frontmatter or derive from filename
    const slug = page.data.permalink 
      ? page.data.permalink.replace(/^\/|\/$/g, '')
      : page.id.replace(/\.md$/, '');
    
    return {
      params: { slug },
      props: { page },
    };
  });
}

const { page } = Astro.props;
const { Content } = await page.render();
---

<PageLayout frontmatter={page.data}>
  <Content />
</PageLayout>
```

### Homepage

**Jekyll Pattern:** `/` (index.md)

**Astro Implementation:** `src/pages/index.astro`

```astro
---
import { getCollection } from 'astro:content';
import BaseLayout from '@layouts/BaseLayout.astro';
import PostCard from '@components/PostCard.astro';

const posts = (await getCollection('posts'))
  .sort((a, b) => new Date(b.data.date) - new Date(a.data.date))
  .slice(0, 10); // Show latest 10 posts
---

<BaseLayout title="Ben Balter" description="Technology leadership, collaboration, and open source">
  <div class="posts">
    {posts.map(post => <PostCard post={post} />)}
  </div>
</BaseLayout>
```

---

## Frontmatter Specification

### Blog Post Frontmatter

**Required Fields:**

```yaml
---
title: Post Title
description: Brief description for SEO (150-160 characters recommended)
---
```

**Optional Fields:**

```yaml
---
title: Post Title
description: Brief description for SEO
date: 2023-05-19                    # Auto-parsed from filename if missing
redirect_from:                       # Old URLs to redirect from
  - /old-url/
  - /another-old-url/
comments: true                       # Enable comments (default: true)
permalink: /custom-url/              # Custom URL (rare)
archived: false                      # Mark as archived
image: /assets/img/post-image.jpg   # Featured image
---
```

### Static Page Frontmatter

**Required Fields:**

```yaml
---
title: Page Title
description: Page description for SEO
---
```

**Optional Fields:**

```yaml
---
title: Page Title
description: Page description for SEO
permalink: /custom-url/              # Custom URL path
layout: page                         # Layout name (optional)
published: true                      # Publish status
seo:
  type: person                       # Schema.org type for structured data
---
```

### Resume Position Frontmatter

**Required Fields:**

```yaml
---
employer: Company Name
title: Job Title
start_date: '2023-02-21'
---
```

**Optional Fields:**

```yaml
---
employer: Company Name
title: Job Title
start_date: '2023-02-21'
end_date: '2024-07-08'               # Omit for current position
---
```

---

## Data Files and Collections

### Site Configuration

**File:** `src/data/site.yml`

**Structure:**

```yaml
title: Ben Balter
description: Technology leadership, collaboration, and open source
url: https://ben.balter.com
author:
  name: Ben Balter
  email: ben@balter.com
  twitter: benbalter
  github: benbalter
social:
  - name: Twitter
    url: https://twitter.com/BenBalter
  - name: GitHub
    url: https://github.com/benbalter
```

**Astro Usage:**

```typescript
import siteData from '@data/site.yml';
```

### Book Recommendations

**File:** `src/data/books.yml`

**Structure:**

```yaml
- category: IT Management
  books:
    - title: The Phoenix Project
      asin: B078Y98RG8
      tldr: DevOps novel about improving IT operations
```

**Astro Usage:**

```typescript
import books from '@data/books.yml';

// In component
{books.map(category => (
  <section>
    <h2>{category.category}</h2>
    {category.books.map(book => <BookCard book={book} />)}
  </section>
))}
```

### Press Clips

**File:** `src/data/clips.yml`

**Structure:**

```yaml
- title: Article Title
  publication: Publication Name
  url: https://example.com/article
  date: 2023-01-15
```

### Related Posts

**File:** `src/data/related-posts.yml` (Generated at build time)

**Structure:**

```yaml
2023-05-19-pull-requests-are-a-form-of-documentation:
  - 2023-03-02-github-for-non-technical-roles
  - 2020-08-14-tools-of-the-trade
  - 2015-11-12-why-urls
```

**Generation Script:** `scripts/build-related-posts.ts`

---

## Features Implementation

### 1. RSS Feeds

**Main Feed:** `src/pages/feed.xml.ts`

```typescript
import rss from '@astrojs/rss';
import { getCollection } from 'astro:content';
import type { APIContext } from 'astro';

export async function GET(context: APIContext) {
  const posts = await getCollection('posts');
  const sortedPosts = posts
    .sort((a, b) => new Date(b.data.date).getTime() - new Date(a.data.date).getTime())
    .slice(0, 20);

  return rss({
    title: 'Ben Balter',
    description: 'Technology leadership, collaboration, and open source',
    site: context.site!,
    items: sortedPosts.map(post => ({
      title: post.data.title,
      description: post.data.description,
      link: `/[year]/[month]/[day]/${post.slug}/`,
      pubDate: new Date(post.data.date),
    })),
    customData: '<language>en-us</language>',
  });
}
```

**Press Feed:** `src/pages/press-feed.xml.ts`

```typescript
import rss from '@astrojs/rss';
import clipsData from '@data/clips.yml';
import type { APIContext } from 'astro';

export async function GET(context: APIContext) {
  return rss({
    title: 'Ben Balter - Press',
    description: 'Press mentions and media appearances',
    site: context.site!,
    items: clipsData.map(clip => ({
      title: clip.title,
      description: `${clip.publication}`,
      link: clip.url,
      pubDate: new Date(clip.date),
    })),
  });
}
```

### 2. XML Sitemap

**Using @astrojs/sitemap Integration:**

```typescript
// astro.config.mjs
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://ben.balter.com',
  integrations: [
    sitemap({
      filter: (page) => !page.includes('/404/'),
    }),
  ],
});
```

### 3. Redirects

**Implementation:** Using `astro-redirect-from` plugin and Astro's native redirects

**Internal Redirects (redirect_from):** Handled by `astro-redirect-from` plugin

```typescript
// astro.config.mjs
import redirectFrom from 'astro-redirect-from';

export default defineConfig({
  integrations: [
    // Handle redirect_from in frontmatter
    redirectFrom({
      contentDir: 'src/content',
      getSlug: customGetSlugFunction, // Reads permalink from frontmatter
    }),
  ],
});
```

**External Redirects (redirect_to):** Handled by Astro's native redirects config

```typescript
// astro.config.mjs
export default defineConfig({
  redirects: {
    // External redirects for republished posts
    '/2023/10/04/how-to-communicate-like-a-github-engineer/': 
      'https://github.blog/engineering/...',
    '/2015/04/27/eight-lessons-learned-hacking-on-github-pages-for-six-months/': 
      'https://github.com/blog/1992-...',
    '/2012/04/23/enterprise-open-source-usage-is-up-but-challenges-remain/': 
      'http://techcrunch.com/2012/04/22/...',
  },
});
```

**Benefits:**

- Community-maintained plugin (90% less custom code)
- Automatic redirect generation at build time
- Leverages Astro's native redirect system
- Supports both internal and external redirects

### 4. Related Posts

**Component:** `src/components/RelatedPosts.astro`

```astro
---
import { getCollection } from 'astro:content';
import relatedPostsData from '@data/related-posts.yml';

interface Props {
  postSlug: string;
}

const { postSlug } = Astro.props;

// Get related post slugs from data file
const relatedSlugs = relatedPostsData[postSlug] || [];

// Fetch related posts
const allPosts = await getCollection('posts');
const relatedPosts = allPosts.filter(post => 
  relatedSlugs.includes(post.id.replace('.md', ''))
);
---

{relatedPosts.length > 0 && (
  <aside class="related-posts">
    <h2>Related Posts</h2>
    <ul>
      {relatedPosts.map(post => (
        <li>
          <a href={`/[year]/[month]/[day]/${post.slug}/`}>
            {post.data.title}
          </a>
        </li>
      ))}
    </ul>
  </aside>
)}
```

**Generation:** Run `scripts/build-related-posts.ts` before build to generate `related-posts.yml`

### 5. SEO Meta Tags

**Component:** `src/components/SEO.astro`

```astro
---
import { SEO } from 'astro-seo';

interface Props {
  title: string;
  description: string;
  image?: string;
  type?: string;
}

const { title, description, image, type = 'website' } = Astro.props;
const canonicalURL = new URL(Astro.url.pathname, Astro.site);
---

<SEO
  title={title}
  description={description}
  canonical={canonicalURL.toString()}
  openGraph={{
    basic: {
      title: title,
      type: type,
      image: image || 'https://ben.balter.com/assets/img/headshot.jpg',
    },
    optional: {
      description: description,
      siteName: 'Ben Balter',
    },
  }}
  twitter={{
    card: 'summary_large_image',
    site: '@benbalter',
    creator: '@benbalter',
  }}
/>
```

### 6. GitHub Features (Emoji, Mentions, Avatars)

**Emoji:** Use `remark-emoji` plugin

```typescript
// astro.config.mjs
import { defineConfig } from 'astro/config';
import remarkEmoji from 'remark-emoji';

export default defineConfig({
  markdown: {
    remarkPlugins: [remarkEmoji],
  },
});
```

**Mentions:** Custom remark plugin

```typescript
// src/utils/remark-mentions.ts
import { visit } from 'unist-util-visit';

export function remarkMentions() {
  return (tree: any) => {
    visit(tree, 'text', (node) => {
      const text = node.value;
      const mentionRegex = /@(\w+)/g;
      
      if (mentionRegex.test(text)) {
        // Replace with link node
        // Implementation details...
      }
    });
  };
}
```

**GitHub Avatars:** Build-time fetch and optimization

The site's author avatar is fetched at build time and optimized by Astro's Image component:

```typescript
// src/lib/astro-fetch-avatar.ts
import type { AstroIntegration } from 'astro';
import { writeFile, mkdir } from 'node:fs/promises';
import { siteConfig } from '../config.js';

// Fetch at build time and save to assets directory
export default function fetchAvatar(): AstroIntegration {
  return {
    name: 'fetch-avatar',
    hooks: {
      'astro:build:start': async ({ logger }) => {
        // Fetch full-size avatar for highest quality source
        const response = await fetch(
          `https://avatars.githubusercontent.com/${siteConfig.githubUsername}`
        );
        // Save to assets/img/avatar.png for Astro's Image optimization
      },
    },
  };
}
```

```astro
---
// MiniBio.astro - Uses Astro's Image component for optimization
import { Image } from 'astro:assets';
import avatarImage from '../../assets/img/avatar.png';

// Astro automatically converts to WebP/AVIF formats
---

<Image 
  src={avatarImage}
  alt="Author name"
  width={100}
  height={100}
  loading="lazy"
/>
```

Benefits:
- **87% smaller**: PNG → optimized WebP (e.g., 18KB → 2.2KB)
- **No external requests**: Served from same domain
- **Modern formats**: Automatic WebP/AVIF generation

---

## Build Pipeline

### 1. Configuration

**File:** `astro.config.mjs`

```javascript
import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import remarkEmoji from 'remark-emoji';
import remarkGfm from 'remark-gfm';

export default defineConfig({
  site: 'https://ben.balter.com',
  
  // Output static files for GitHub Pages
  output: 'static',
  
  // Trailing slash for GitHub Pages compatibility
  trailingSlash: 'always',
  
  // Markdown configuration
  markdown: {
    remarkPlugins: [
      remarkGfm,
      remarkEmoji,
      // Custom plugins...
    ],
    rehypePlugins: [
      // Syntax highlighting, etc.
    ],
  },
  
  // Integrations
  integrations: [
    mdx(),
    sitemap({
      filter: (page) => !page.includes('/404/'),
    }),
  ],
  
  // Build configuration
  build: {
    format: 'directory', // /about/ instead of /about.html
  },
});
```

### 2. Build Steps

1. **Pre-build:** Generate related posts data

   ```bash
   npm run build:related-posts
   ```

2. **Build:** Generate static site (redirects auto-generated by plugin)

   ```bash
   npm run build
   ```

**Package.json scripts:**

```json
{
  "scripts": {
    "dev": "astro dev",
    "build": "npm run build:related-posts && astro build",
    "build:related-posts": "tsx scripts/build-related-posts.ts",
    "preview": "astro preview"
  }
}
```

**Note:** Redirects are now automatically generated during the build by the `astro-redirect-from` plugin, eliminating the need for a separate post-build redirect script.

### 3. GitHub Actions Workflow

**File:** `.github/workflows/deploy.yml`

```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches: [main]
  workflow_dispatch:

permissions:
  contents: read
  pages: write
  id-token: write

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout
        uses: actions/checkout@v4
      
      - name: Setup Node
        uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: npm
      
      - name: Install dependencies
        run: npm ci
      
      - name: Build site
        run: npm run build
      
      - name: Upload artifact
        uses: actions/upload-pages-artifact@v3
        with:
          path: ./dist

  deploy:
    needs: build
    runs-on: ubuntu-latest
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    steps:
      - name: Deploy to GitHub Pages
        id: deployment
        uses: actions/deploy-pages@v4
```

---

## Migration Checklist

### Phase 1: Setup (Week 1)

- [ ] Install Astro and dependencies
- [ ] Configure `astro.config.mjs`
- [ ] Set up directory structure
- [ ] Configure content collections
- [ ] Set up TypeScript
- [ ] Configure linting and formatting

### Phase 2: Content Migration (Week 1–2)

- [ ] Move blog posts to `src/content/posts/`
- [ ] Move static pages to `src/content/pages/`
- [ ] Move resume positions to `src/content/resume-positions/`
- [ ] Copy data files to `src/data/`
- [ ] Verify all frontmatter fields
- [ ] Test content collection schemas

### Phase 3: Layouts and Components (Week 2–3)

- [ ] Create base layout
- [ ] Create post layout
- [ ] Create page layout
- [ ] Build header component
- [ ] Build footer component
- [ ] Build navigation component
- [ ] Build post card component
- [ ] Build related posts component
- [ ] Style components with Tailwind CSS utilities

### Phase 4: Routing (Week 3)

- [ ] Implement `[year]/[month]/[day]/[slug].astro`
- [ ] Implement `[...slug].astro` for pages
- [ ] Implement `index.astro` homepage
- [ ] Test all URL patterns
- [ ] Verify trailing slashes

### Phase 5: Features (Week 3–4)

- [ ] Implement RSS feed generation
- [ ] Implement press feed generation
- [ ] Configure sitemap integration
- [ ] Build redirect generation script
- [ ] Build related posts generation script
- [ ] Implement SEO meta tags
- [ ] Add emoji support
- [ ] Add GitHub mentions support
- [x] Add GitHub avatar component (fetched at build time, served as optimized WebP)
- [ ] Test all features

### Phase 6: Testing (Week 4–5)

- [ ] Test all blog post URLs (184 posts)
- [ ] Test all static page URLs (10 pages)
- [ ] Test all redirects (18 mappings)
- [ ] Validate RSS feeds
- [ ] Validate sitemap
- [ ] Test SEO meta tags
- [ ] Test Open Graph images
- [ ] Test related posts
- [ ] Performance testing
- [ ] Accessibility testing
- [ ] Cross-browser testing

### Phase 7: Deployment (Week 5–6)

- [ ] Set up GitHub Actions workflow
- [ ] Configure GitHub Pages
- [ ] Test deployment pipeline
- [ ] DNS configuration
- [ ] SSL/TLS verification
- [ ] Post-deployment testing
- [ ] Monitor for broken links
- [ ] Monitor search rankings

### Phase 8: Post-Launch (Week 6+)

- [ ] Monitor analytics
- [ ] Fix any issues
- [ ] Gather feedback
- [ ] Document learnings
- [ ] Plan future improvements

---

## URL Mapping Reference

### Blog Posts (184 total)

**Pattern:** `/YYYY/MM/DD/slug/`

**Sample URLs:**

```
/2023/05/19/pull-requests-are-a-form-of-documentation/
/2020/01/17/ten-lessons-learned-fostering-a-community-of-communities-on-github/
/2015/11-12/why-urls/
/2010/09/12/wordpress-resume-plugin/
```

**All URLs preserved exactly as-is**

### Static Pages (10 total)

| Jekyll URL                    | Astro Route                 | File                           |
| ----------------------------- | --------------------------- | ------------------------------ |
| `/`                           | `src/pages/index.astro`     | Homepage                       |
| `/about/`                     | `src/pages/[...slug].astro` | `about.md`                     |
| `/resume/`                    | `src/pages/[...slug].astro` | `resume.md`                    |
| `/contact/`                   | `src/pages/[...slug].astro` | `contact.md`                   |
| `/talks/`                     | `src/pages/[...slug].astro` | `talks.md`                     |
| `/press/`                     | `src/pages/[...slug].astro` | `press.md`                     |
| `/fine-print/`                | `src/pages/[...slug].astro` | `fine-print.md`                |
| `/other-recommended-reading/` | `src/pages/[...slug].astro` | `other-recommended-reading.md` |
| `/404/`                       | `src/pages/404.astro`       | 404 page                       |

### Special URLs

| URL                         | Purpose         | Implementation                      |
| --------------------------- | --------------- | ----------------------------------- |
| `/feed.xml`                 | Main RSS feed   | `src/pages/feed.xml.ts`             |
| `/press/feed/index.xml`     | Press feed      | `src/pages/press/feed/index.xml.ts` |
| `/sitemap.xml`              | XML sitemap     | `@astrojs/sitemap`                  |
| `/robots.txt`               | Crawler rules   | `public/robots.txt`                 |
| `/humans.txt`               | Credits         | `public/humans.txt`                 |
| `/.well-known/security.txt` | Security policy | `public/.well-known/security.txt`   |

### Redirects (18 mappings)

**Implementation:** HTML redirect files generated at build time

**Example:**

- From: `/cv/` → To: `/resume/`
- From: `/2014/09/29/your-code-deserves-better/` → To: `/2014/09/29/source-disclosed-is-not-the-same-as-open-source/`

---

## Comparison: Jekyll vs Astro

| Feature            | Jekyll                                   | Astro                                 |
| ------------------ | ---------------------------------------- | ------------------------------------- |
| **Content Format** | Markdown with YAML frontmatter           | Markdown with YAML frontmatter        |
| **Collections**    | `_posts/`, `_pages/`, custom collections | `src/content/` with type-safe schemas |
| **URL Structure**  | Permalink config + frontmatter           | Dynamic routes with `[param]` syntax  |
| **Data Files**     | `_data/*.yml`                            | `src/data/*.yml` or imports           |
| **Layouts**        | Liquid templates in `_layouts/`          | Astro components in `src/layouts/`    |
| **Components**     | Liquid includes in `_includes/`          | Astro components in `src/components/` |
| **Plugins**        | Ruby gems                                | JavaScript integrations               |
| **Build Time**     | Slower (Ruby)                            | Faster (JavaScript/Vite)              |
| **Dev Experience** | Hot reload (slower)                      | HMR (faster)                          |
| **Type Safety**    | No                                       | Yes (TypeScript + Zod schemas)        |

---

## Benefits of Astro Migration

1. **Performance**
   - Faster build times
   - Zero JavaScript by default
   - Better Core Web Vitals

2. **Developer Experience**
   - Modern JavaScript tooling
   - TypeScript support
   - Fast HMR
   - Better error messages

3. **Content Safety**
   - Type-safe content collections
   - Schema validation
   - Compile-time errors

4. **Flexibility**
   - Bring your own UI framework
   - More control over build process
   - Better integration ecosystem

5. **Maintenance**
   - Active development
   - Large community
   - Regular updates
   - Better documentation

---

## Risks and Mitigation

### Risk 1: URL Changes

**Impact:** SEO damage, broken external links\
**Mitigation:**

- Comprehensive redirect mapping
- URL verification tests
- Pre-launch URL audit

### Risk 2: Feature Loss

**Impact:** Missing functionality from Jekyll plugins\
**Mitigation:**

- Feature parity checklist
- Custom implementations where needed
- Thorough testing

### Risk 3: Build Complexity

**Impact:** More complex build pipeline\
**Mitigation:**

- Clear documentation
- Automated scripts
- CI/CD integration

### Risk 4: Migration Errors

**Impact:** Content corruption, data loss\
**Mitigation:**

- Version control
- Automated testing
- Gradual migration
- Backup strategy

---

## Success Criteria

### Must Have (Launch Blockers)

✅ All 184 blog post URLs work identically\
✅ All 10 static page URLs work identically\
✅ All 18 redirects function correctly\
✅ RSS feeds validate and work\
✅ Sitemap generates correctly\
✅ SEO meta tags present and correct\
✅ Build completes successfully

### Should Have (Post-Launch Fix)

✅ Related posts feature works\
✅ Code syntax highlighting works\
✅ Images display correctly\
✅ Tables render properly\
✅ Page load times same or better

### Nice to Have (Future Enhancement)

✅ Emoji rendering works\
✅ @mentions link to GitHub\
✅ Avatar images display\
✅ Open Graph images generate\
✅ Search functionality

---

## Conclusion

This architecture design provides a complete roadmap for migrating ben.balter.com from Jekyll to Astro while maintaining:

- **100% URL compatibility** - All existing URLs preserved
- **Feature parity** - All current features replicated
- **SEO preservation** - No loss of search rankings
- **Performance improvement** - Faster builds and page loads
- **Better DX** - Modern tooling and type safety

**Estimated Timeline:** 6 weeks for complete migration with testing

**Key Advantage:** Type-safe content collections with Zod schemas prevent content errors at build time.

**Next Steps:**

1. Review and approve this design
2. Set up Astro project structure
3. Begin content migration
4. Implement routing and features
5. Comprehensive testing
6. Deploy

---

**Document Version:** 1.0\
**Last Updated:** December 8, 2024\
**Status:** Ready for Review
