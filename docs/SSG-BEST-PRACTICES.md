# Static Site Generation (SSG) Best Practices

This document outlines the SSG-first architecture and best practices for this Next.js site.

## Core Principle: Maximize Static HTML, Minimize JavaScript

This site is built with **Static Site Generation (SSG)** as the primary rendering strategy. All pages are pre-rendered as static HTML at build time, with minimal client-side JavaScript.

### Why SSG?

* ⚡ **Performance**: Fastest possible page loads (pre-rendered HTML)
* 🔒 **Security**: No server-side code execution, no APIs to exploit
* 💰 **Cost**: Free hosting on GitHub Pages
* 📈 **SEO**: Perfect for search engines (fully rendered HTML)
* 🌍 **Reliability**: No servers to crash, no databases to fail
* ♿ **Accessibility**: Works without JavaScript

## Architecture Overview

### Current State

* **Total Pages**: \~200 (blog posts + static pages)
* **Build Output**: Static HTML files only (`output: 'export'`)
* **Client Components**: 2 (see below)
* **Server Components**: All others (\~15+ components)
* **JavaScript Bundle**: Minimal (\~50KB including Bootstrap)

### The Two Client Components

**ONLY these two components use 'use client' (both necessary):**

1. **`app/components/ClientScripts.tsx`**
   * **Purpose**: Initialize Bootstrap tooltips and FontAwesome icons
   * **Why Client**: Requires `useEffect` to run after DOM ready
   * **Usage**: Included once in root layout
   * **Size**: \~500 bytes

2. **`app/components/Navigation.tsx`**
   * **Purpose**: Highlight active navigation link
   * **Why Client**: Requires `usePathname()` hook from Next.js
   * **Usage**: Navigation bar in header
   * **Size**: \~1KB

**These are the ONLY client components. Keep it this way.**

## Decision Tree: Server Component vs Client Component

Use this decision tree when creating or modifying components:

```
Does it need browser APIs (window, document, localStorage)?
├─ YES → Client Component (use 'use client')
└─ NO → Continue

Does it need React hooks (useState, useEffect, useContext)?
├─ YES → Client Component (use 'use client')
└─ NO → Continue

Does it need event handlers that update component state?
├─ YES → Client Component (use 'use client')
└─ NO → Continue

Does it use third-party libraries requiring browser environment?
├─ YES → Client Component (use 'use client')
└─ NO → Server Component (default, no directive needed)
```

## What NEVER Needs 'use client'

### ❌ Navigation Links

```typescript
// ✅ CORRECT - Server Component
import Link from 'next/link';

export default function BlogLink({ post }) {
  return <Link href={post.url}>{post.title}</Link>;
}

// ❌ WRONG - Unnecessary client component
'use client';
import Link from 'next/link';

export default function BlogLink({ post }) {
  return <Link href={post.url}>{post.title}</Link>;
}
```

### ❌ Data Display

```typescript
// ✅ CORRECT - Server Component with async data fetching
import { getPost } from '@/lib/posts';

export default async function PostContent({ slug }) {
  const post = await getPost(slug);
  return <article dangerouslySetInnerHTML={{ __html: post.html }} />;
}

// ❌ WRONG - Fetching data client-side
'use client';
import { useState, useEffect } from 'react';

export default function PostContent({ slug }) {
  const [post, setPost] = useState(null);
  useEffect(() => {
    fetch(`/api/posts/${slug}`).then(r => r.json()).then(setPost);
  }, [slug]);
  // Note: Using dangerouslySetInnerHTML is risky in both server and client components.
  // The key difference here is where data fetching happens (server vs client), not the rendering approach.
  return post ? <article dangerouslySetInnerHTML={{ __html: post.html }} /> : <div>Loading...</div>;
}
```

### ❌ Markdown Rendering

```typescript
// ✅ CORRECT - Process markdown at build time
import { markdownToHtml } from '@/lib/markdown';

export default async function MarkdownContent({ markdown }) {
  const html = await markdownToHtml(markdown);
  return <div dangerouslySetInnerHTML={{ __html: html }} />;
}

// ❌ WRONG - Processing markdown client-side
'use client';
import { useState, useEffect } from 'react';
import { marked } from 'marked';

export default function MarkdownContent({ markdown }) {
  const [html, setHtml] = useState('');
  useEffect(() => {
    setHtml(marked(markdown));
  }, [markdown]);
  return <div dangerouslySetInnerHTML={{ __html: html }} />;
}
```

### ❌ SEO Metadata

```typescript
// ✅ CORRECT - Server Component with generateMetadata
import { getPost } from '@/lib/posts';

export async function generateMetadata({ params }) {
  const post = await getPost(params.slug);
  return {
    title: post.title,
    description: post.description,
  };
}

export default async function PostPage({ params }) {
  const post = await getPost(params.slug);
  return <article>{post.title}</article>;
}

// ❌ WRONG - Using client-side meta tags (doesn't help SEO)
'use client';
import Head from 'next/head';

export default function PostPage({ post }) {
  return (
    <>
      <Head>
        <title>{post.title}</title>
      </Head>
      <article>{post.title}</article>
    </>
  );
}
```

## What CAN Use 'use client' (Rare Cases)

### ✅ Active Link Highlighting

```typescript
// ✅ CORRECT - Needs usePathname() for active state
'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function NavLink({ href, children }) {
  const pathname = usePathname();
  const isActive = pathname === href;
  return (
    <Link href={href} className={isActive ? 'active' : ''}>
      {children}
    </Link>
  );
}
```

### ✅ Client-Side State Management

```typescript
// ✅ CORRECT - Needs useState for interactive form
'use client';
import { useState } from 'react';

export default function SearchBox() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);

  const handleSearch = async () => {
    const data = await fetch(`/api/search?q=${query}`).then(r => r.json());
    setResults(data);
  };

  return (
    <div>
      <input value={query} onChange={e => setQuery(e.target.value)} />
      <button onClick={handleSearch}>Search</button>
      <ul>{results.map(r => <li key={r.id}>{r.title}</li>)}</ul>
    </div>
  );
}
```

### ✅ Browser API Access

```typescript
// ✅ CORRECT - Needs localStorage (browser API)
'use client';
import { useState, useEffect } from 'react';

export default function ThemeToggle() {
  const [theme, setTheme] = useState('light');

  useEffect(() => {
    const saved = localStorage.getItem('theme');
    if (saved) setTheme(saved);
  }, []);

  const toggle = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);
  };

  return <button onClick={toggle}>Toggle Theme</button>;
}
```

## Composition Pattern: Minimize Client Components

When you need interactivity, keep client components as small as possible:

```typescript
// ✅ EXCELLENT - Only the interactive part is a client component

// app/posts/[slug]/page.tsx - Server Component
import { getPost } from '@/lib/posts';
import { InteractiveLikes } from './InteractiveLikes';

export default async function PostPage({ params }) {
  const post = await getPost(params.slug);

  return (
    <article>
      <h1>{post.title}</h1>
      <div dangerouslySetInnerHTML={{ __html: post.html }} />
      <InteractiveLikes postId={post.id} initialLikes={post.likes} />
    </article>
  );
}

// app/posts/[slug]/InteractiveLikes.tsx - Tiny Client Component
'use client';
import { useState } from 'react';

export function InteractiveLikes({ postId, initialLikes }) {
  const [likes, setLikes] = useState(initialLikes);
  return (
    <button onClick={() => setLikes(likes + 1)}>
      ❤️ {likes}
    </button>
  );
}
```

```typescript
// ❌ BAD - Entire page is a client component unnecessarily

// app/posts/[slug]/page.tsx - Client Component (WRONG!)
'use client';
import { useState, useEffect } from 'react';

export default function PostPage({ params }) {
  const [post, setPost] = useState(null);
  const [likes, setLikes] = useState(0);

  useEffect(() => {
    // ❌ Anti-pattern: Fetch post client-side (bad for SEO, slow, and WILL NOT WORK with SSG/static export)
    // This will fail because API routes like `/api/posts/${params.slug}` do not exist in a static export.
    // Do NOT use client-side fetch for page data in SSG. Use static data fetching at build time instead.
    fetch(`/api/posts/${params.slug}`).then(r => r.json()).then(setPost);
  }, [params.slug]);

  if (!post) return <div>Loading...</div>;

  return (
    <article>
      <h1>{post.title}</h1>
      <div dangerouslySetInnerHTML={{ __html: post.html }} />
      <button onClick={() => setLikes(likes + 1)}>❤️ {likes}</button>
    </article>
  );
}
```

## HTML and CSS Over JavaScript

Prefer HTML and CSS for features that don't require state:

### ❌ JavaScript for Hover Effects

```typescript
// ❌ WRONG - Using JavaScript for hover
'use client';
import { useState } from 'react';

export default function HoverCard() {
  const [hovered, setHovered] = useState(false);
  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className={hovered ? 'card-hovered' : 'card'}
    >
      Content
    </div>
  );
}
```

### ✅ CSS for Hover Effects

```typescript
// ✅ CORRECT - Using CSS for hover
export default function HoverCard() {
  return (
    <div className="card">
      Content
    </div>
  );
}

// In CSS:
// .card:hover { transform: scale(1.05); }
```

### ❌ JavaScript for Accordions

```typescript
// ❌ WRONG - JavaScript accordion
'use client';
import { useState } from 'react';

export default function Accordion({ items }) {
  const [open, setOpen] = useState(null);
  return (
    <div>
      {items.map((item, i) => (
        <div key={i}>
          <button onClick={() => setOpen(open === i ? null : i)}>
            {item.title}
          </button>
          {open === i && <div>{item.content}</div>}
        </div>
      ))}
    </div>
  );
}
```

### ✅ HTML for Accordions

```typescript
// ✅ CORRECT - HTML details/summary
export default function Accordion({ items }) {
  return (
    <div>
      {items.map((item, i) => (
        <details key={i}>
          <summary>{item.title}</summary>
          <div>{item.content}</div>
        </details>
      ))}
    </div>
  );
}
```

## Build-Time Processing

All dynamic content should be processed at build time:

### ✅ Related Posts

```typescript
// Generated at build time by script/build-related-posts.ts
// Stored in _data/related_posts.yml
// Loaded in server components

import { getRelatedPosts } from '@/lib/data';

export default async function RelatedPosts({ postSlug }) {
  const related = await getRelatedPosts(postSlug);
  return (
    <ul>
      {related.map(slug => <li key={slug}>{slug}</li>)}
    </ul>
  );
}
```

### ✅ RSS Feeds

```typescript
// Generated at build time by script/generate-feeds.mjs
// Outputs to public/feed.xml
// No runtime generation needed
```

### ✅ Redirects

```typescript
// Generated at build time by script/generate-redirects.mjs
// Creates static HTML redirect pages
// No client-side JavaScript needed for redirects
```

## Testing for SSG Compliance

Before merging any changes:

1. **Check for 'use client' usage**:

   ```bash
   grep -r '^["'\'']use client["'\'']' app/
   # Should only show ClientScripts.tsx and Navigation.tsx
   ```

2. **Verify build output is static**:

   ```bash
   npm run next:build
   # Check that all routes are marked with ○ (Static) or ● (SSG)
   # Never should see λ (Server/API routes)
   ```

3. **Check JavaScript bundle size**:

   ```bash
   ls -lh out/_next/static/chunks/
   # Verify minimal JS bundle size
   ```

4. **Disable JavaScript and test**:
   * Open site in browser
   * Disable JavaScript in DevTools
   * Verify navigation, links, and content still work
   * Only interactive features (Bootstrap dropdowns, etc.) should break

## Migration Checklist

When migrating Jekyll to Next.js or adding new features:

* [ ] Is this page pre-rendered at build time using `generateStaticParams`?
* [ ] Are all components server components (no 'use client')?
* [ ] Is data fetched at build time, not runtime?
* [ ] Are Markdown files processed at build time?
* [ ] Are RSS feeds and sitemaps generated at build time?
* [ ] Are redirects handled with static HTML files?
* [ ] Is interactivity limited to absolutely necessary features?
* [ ] Are CSS and HTML preferred over JavaScript?
* [ ] Does the site work without JavaScript enabled?

## Resources

* [Next.js Static Exports](https://nextjs.org/docs/app/building-your-application/deploying/static-exports)
* [Server Components](https://nextjs.org/docs/app/building-your-application/rendering/server-components)
* [Client Components](https://nextjs.org/docs/app/building-your-application/rendering/client-components)
* [When to use Server vs Client Components](https://nextjs.org/docs/app/building-your-application/rendering/composition-patterns)
* [Static Site Generation with App Router](https://nextjs.org/docs/app/building-your-application/data-fetching/caching-and-revalidating)

## Summary

**Golden Rules:**

1. ✅ **Server components by default** - No 'use client' directive needed
2. ✅ **Static HTML generation** - All pages pre-rendered at build time
3. ✅ **HTML and CSS first** - Avoid JavaScript when possible
4. ✅ **Minimal client JavaScript** - Only 2 client components currently
5. ✅ **Build-time processing** - Markdown, data, feeds generated during build
6. ❌ **NEVER use 'use client' unless absolutely necessary** - Ask first!
