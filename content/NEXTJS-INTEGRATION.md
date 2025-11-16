# Next.js Integration Example

This file provides example code for integrating the migrated content with Next.js.

**IMPORTANT: This site uses Static Site Generation (SSG) with minimal client-side JavaScript.**

See [docs/SSG-BEST-PRACTICES.md](../docs/SSG-BEST-PRACTICES.md) for complete guidelines on:

* When to use server components vs client components
* How to avoid unnecessary 'use client' directives
* Maximizing static HTML generation
* Preferring HTML/CSS over JavaScript

## Installation

```bash
npm install gray-matter remark remark-html remark-gfm remark-footnotes js-yaml
```

## Content Loader Utilities

### lib/posts.ts

```typescript
import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

const postsDirectory = path.join(process.cwd(), 'content/posts');

export interface Post {
  slug: string;
  date: string;
  title: string;
  description?: string;
  image?: string;
  content: string;
  [key: string]: any;
}

export function getAllPosts(): Post[] {
  const fileNames = fs.readdirSync(postsDirectory);
  
  const posts = fileNames
    .filter(fileName => fileName.endsWith('.md'))
    .map(fileName => {
      const slug = fileName.replace(/\.md$/, '');
      const fullPath = path.join(postsDirectory, fileName);
      const fileContents = fs.readFileSync(fullPath, 'utf8');
      const { data, content } = matter(fileContents);
      
      // Extract date from filename if not in frontmatter
      let date = data.date;
      if (!date) {
        const match = fileName.match(/^(\d{4})-(\d{2})-(\d{2})-/);
        if (match) {
          date = `${match[1]}-${match[2]}-${match[3]}`;
        }
      }
      
      // Generate title from filename if not in frontmatter
      let title = data.title;
      if (!title) {
        title = fileName
          .replace(/^\d{4}-\d{2}-\d{2}-/, '')
          .replace(/\.md$/, '')
          .replace(/-/g, ' ')
          .replace(/\b\w/g, l => l.toUpperCase());
      }
      
      return {
        slug,
        date,
        title,
        description: data.description,
        image: data.image,
        content,
        ...data,
      };
    });
  
  // Sort by date (newest first)
  return posts.sort((a, b) => {
    return new Date(b.date).getTime() - new Date(a.date).getTime();
  });
}

export function getPostBySlug(slug: string): Post | null {
  const posts = getAllPosts();
  return posts.find(post => post.slug === slug) || null;
}

export function getPostByDate(year: string, month: string, day: string, slug: string): Post | null {
  const fullSlug = `${year}-${month}-${day}-${slug}`;
  return getPostBySlug(fullSlug);
}
```

### lib/pages.ts

```typescript
import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

const pagesDirectory = path.join(process.cwd(), 'content/pages');

export interface Page {
  slug: string;
  title?: string;
  description?: string;
  content: string;
  [key: string]: any;
}

export function getPageBySlug(slug: string): Page | null {
  const extensions = ['.md', '.html'];
  
  for (const ext of extensions) {
    const fullPath = path.join(pagesDirectory, `${slug}${ext}`);
    
    if (fs.existsSync(fullPath)) {
      const fileContents = fs.readFileSync(fullPath, 'utf8');
      const { data, content } = matter(fileContents);
      
      return {
        slug,
        title: data.title,
        description: data.description,
        content,
        ...data,
      };
    }
  }
  
  return null;
}

export function getAllPages(): Page[] {
  const fileNames = fs.readdirSync(pagesDirectory);
  
  return fileNames
    .filter(fileName => fileName.endsWith('.md') || fileName.endsWith('.html'))
    .map(fileName => {
      const slug = fileName.replace(/\.(md|html)$/, '');
      const fullPath = path.join(pagesDirectory, fileName);
      const fileContents = fs.readFileSync(fullPath, 'utf8');
      const { data, content } = matter(fileContents);
      
      return {
        slug,
        title: data.title,
        description: data.description,
        content,
        ...data,
      };
    });
}
```

### lib/data.ts

```typescript
import fs from 'fs';
import path from 'path';
import yaml from 'js-yaml';

const dataDirectory = path.join(process.cwd(), 'content/data');

export function loadData<T = any>(filename: string): T {
  const fullPath = path.join(dataDirectory, filename);
  const fileContents = fs.readFileSync(fullPath, 'utf8');
  return yaml.load(fileContents) as T;
}

export interface Book {
  title: string;
  asin: string;
  tldr: string;
}

export function getBooks(): Record<string, Book[]> {
  return loadData('books.yml');
}

export interface Clip {
  title: string;
  publication: string;
  url: string;
  date: string;
}

export function getClips(): Clip[] {
  return loadData('clips.yml');
}

export function getRelatedPosts(): Record<string, string[]> {
  return loadData('related_posts.yml');
}
```

### lib/markdown.ts

```typescript
import { remark } from 'remark';
import html from 'remark-html';
import gfm from 'remark-gfm';
import footnotes from 'remark-footnotes';

export async function markdownToHtml(markdown: string): Promise<string> {
  const result = await remark()
    .use(gfm)
    .use(footnotes, { inlineNotes: true })
    .use(html, { sanitize: false })
    .process(markdown);
  
  return result.toString();
}

export function stripHtml(html: string): string {
  return html.replace(/<[^>]*>/g, '');
}
```

## Dynamic Routes

### app/[year]/[month]/[day]/[slug]/page.tsx

```typescript
import { getPostByDate, getAllPosts } from '@/lib/posts';
import { markdownToHtml } from '@/lib/markdown';
import { notFound } from 'next/navigation';

interface Params {
  year: string;
  month: string;
  day: string;
  slug: string;
}

export async function generateStaticParams() {
  const posts = getAllPosts();
  
  return posts.map(post => {
    const [year, month, day, ...rest] = post.slug.split('-');
    return {
      year,
      month,
      day,
      slug: rest.join('-'),
    };
  });
}

export default async function Post({ params }: { params: Params }) {
  const { year, month, day, slug } = params;
  const post = getPostByDate(year, month, day, slug);
  
  if (!post) {
    notFound();
  }
  
  const contentHtml = await markdownToHtml(post.content);
  
  return (
    <article>
      <header>
        <h1>{post.title}</h1>
        {post.description && <p>{post.description}</p>}
        <time dateTime={post.date}>{post.date}</time>
      </header>
      <div dangerouslySetInnerHTML={{ __html: contentHtml }} />
    </article>
  );
}

export async function generateMetadata({ params }: { params: Params }) {
  const { year, month, day, slug } = params;
  const post = getPostByDate(year, month, day, slug);
  
  if (!post) {
    return {};
  }
  
  return {
    title: post.title,
    description: post.description,
    openGraph: {
      title: post.title,
      description: post.description,
      images: post.image ? [{ url: post.image }] : [],
    },
  };
}
```

### app/[slug]/page.tsx

```typescript
import { getPageBySlug, getAllPages } from '@/lib/pages';
import { markdownToHtml } from '@/lib/markdown';
import { notFound } from 'next/navigation';

export async function generateStaticParams() {
  const pages = getAllPages();
  return pages.map(page => ({ slug: page.slug }));
}

export default async function Page({ params }: { params: { slug: string } }) {
  const page = getPageBySlug(params.slug);
  
  if (!page) {
    notFound();
  }
  
  const contentHtml = await markdownToHtml(page.content);
  
  return (
    <div>
      {page.title && <h1>{page.title}</h1>}
      <div dangerouslySetInnerHTML={{ __html: contentHtml }} />
    </div>
  );
}
```

## Redirects

### next.config.mjs

```javascript
/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  
  async redirects() {
    // Handle legacy redirects from _legacy_redirect_from fields
    const redirects = [
      {
        source: '/2023/12/07/cathedral-bazaar-management/',
        destination: '/2023/12/08/cathedral-bazaar-management/',
        permanent: true,
      },
      // Add more redirects as needed
    ];
    
    return redirects;
  },
};

export default nextConfig;
```

## Components

### components/GitHubCulture.tsx

```typescript
// Replace {% include_cached github-culture.html %}
export default function GitHubCulture() {
  return (
    <div className="callout">
      <p>
        This post is part of a series on GitHub culture and practices.
      </p>
    </div>
  );
}
```

### components/Callout.tsx

```typescript
// Replace {% include callout.html content=... %}
interface CalloutProps {
  children: React.ReactNode;
  type?: 'info' | 'warning' | 'success';
}

export default function Callout({ children, type = 'info' }: CalloutProps) {
  return (
    <div className={`callout callout-${type}`}>
      {children}
    </div>
  );
}
```

## Usage Examples

### List all posts

```typescript
import { getAllPosts } from '@/lib/posts';

export default function BlogIndex() {
  const posts = getAllPosts();
  
  return (
    <div>
      <h1>Blog Posts</h1>
      <ul>
        {posts.map(post => (
          <li key={post.slug}>
            <a href={`/${post.date.replace(/-/g, '/')}/${post.slug.replace(/^\d{4}-\d{2}-\d{2}-/, '')}`}>
              {post.title}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}
```

### Load data files

```typescript
import { getBooks, getClips } from '@/lib/data';

export default function BooksPage() {
  const books = getBooks();
  
  return (
    <div>
      {Object.entries(books).map(([category, bookList]) => (
        <section key={category}>
          <h2>{category}</h2>
          <ul>
            {bookList.map(book => (
              <li key={book.asin}>
                <h3>{book.title}</h3>
                <p>{book.tldr}</p>
              </li>
            ))}
          </ul>
        </section>
      ))}
    </div>
  );
}
```

## Testing

```typescript
import { getAllPosts, getPostBySlug } from '@/lib/posts';

describe('Posts', () => {
  it('should load all posts', () => {
    const posts = getAllPosts();
    expect(posts.length).toBeGreaterThan(0);
  });
  
  it('should have valid frontmatter', () => {
    const posts = getAllPosts();
    posts.forEach(post => {
      expect(post.title).toBeDefined();
      expect(post.date).toBeDefined();
      expect(post.content).toBeDefined();
    });
  });
  
  it('should generate title from filename if missing', () => {
    const post = getPostBySlug('2013-08-11-everyone-contributes');
    expect(post?.title).toBe('Everyone Contributes');
  });
});
```
