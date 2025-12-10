# Markdown and MDX Content in Astro

This document explains how to work with Markdown and MDX content in the Astro implementation of Ben Balter's website.

## Overview

Astro supports both Markdown (`.md`) and MDX (`.mdx`) files through its Content Collections API. This provides:

- **Type-safe frontmatter**: Validated with Zod schemas
- **Jekyll compatibility**: Supports existing Jekyll frontmatter fields
- **Rich content**: MDX allows using components in Markdown
- **Performance**: Zero JavaScript by default

## Content Collections

Content is organized into collections in `src/content/`:

```
src/content/
├── config.ts           # Collection schemas
├── posts/              # Blog posts
│   ├── example-markdown-post.md
│   └── example-mdx-post.mdx
└── pages/              # Static pages
    └── example-page.md
```

### Collections Configuration

Collections are defined in `src/content/config.ts` with Zod schemas that validate frontmatter.

#### Posts Collection

For blog posts in `src/content/posts/`:

```typescript
{
  title: string;              // Required: Post title
  description: string;        // Required: Post description
  layout?: string;            // Optional: Layout name
  permalink?: string;         // Optional: Custom URL
  published?: boolean;        // Optional: Published status (default: true)
  image?: string;             // Optional: Open Graph image URL
  comments?: boolean;         // Optional: Enable comments (default: false)
  redirect_from?: string[];   // Optional: Old URLs to redirect from
  redirect_to?: string;       // Optional: URL to redirect to
  tags?: string[];            // Optional: Post tags
  categories?: string[];      // Optional: Post categories
}
```

#### Pages Collection

For static pages in `src/content/pages/`:

```typescript
{
  title: string;              // Required: Page title
  description: string;        // Required: Page description
  layout?: string;            // Optional: Layout name
  permalink?: string;         // Optional: Custom URL
  published?: boolean;        // Optional: Published status (default: true)
  id?: string;                // Optional: Page ID
  icons?: boolean;            // Optional: Enable icons
}
```

## Markdown Files (.md)

Markdown files support standard Markdown syntax plus GitHub Flavored Markdown.

### Example Post

```markdown
---
title: "My Blog Post"
description: "A brief description of the post"
published: true
tags:
  - astro
  - markdown
---

This is a **Markdown** blog post with *standard formatting*.

## Heading 2

Content goes here...
```

### Features

- **Text formatting**: Bold, italic, strikethrough
- **Lists**: Ordered and unordered
- **Links and images**: Standard Markdown syntax
- **Code blocks**: With syntax highlighting
- **Tables**: GitHub Flavored Markdown tables
- **Task lists**: `- [ ]` and `- [x]`
- **Blockquotes**: Using `>` prefix

## MDX Files (.mdx)

MDX extends Markdown by allowing you to use Astro components directly in your content.

### Example MDX Post

```mdx
---
title: "My MDX Post"
description: "A post with components"
---

import Callout from '../../components/Callout.astro';

This is an **MDX** post with components.

<Callout type="info">
This is a callout component!
</Callout>

Regular Markdown content continues...
```

### Available Components

#### Callout

Display important information, warnings, or notes:

```mdx
<Callout type="info" title="Optional Title">
Your content here...
</Callout>
```

Types: `info`, `warning`, `error`, `success`

#### CodeBlock

Enhanced code blocks with titles:

```mdx
<CodeBlock title="example.js" language="javascript">
```javascript
const message = 'Hello!';
```

</CodeBlock>
```

#### YouTube

Embed YouTube videos:

```mdx
<YouTube id="dQw4w9WgXcQ" title="Video Title" />
```

### Creating Custom Components

1. Create component in `src/components/MyComponent.astro`
2. Import in MDX: `import MyComponent from '../../components/MyComponent.astro';`
3. Use in content: `<MyComponent prop="value" />`

## Jekyll Compatibility

The frontmatter schema is designed to be compatible with Jekyll:

### Supported Jekyll Fields

- `title` - Post/page title
- `description` - SEO description
- `layout` - Layout name (mapped to Astro layouts)
- `permalink` - Custom URL path
- `published` - Publication status
- `redirect_from` - Array of old URLs
- `redirect_to` - Redirect destination
- `tags` - Post tags
- `categories` - Post categories
- `comments` - Enable/disable comments
- `image` - Open Graph image

### Date Extraction

For Jekyll-format post filenames (`YYYY-MM-DD-slug.md`), the date is automatically extracted from the filename.

## Working with Content

### Querying Posts

```typescript
import { getCollection } from 'astro:content';

// Get all published posts
const posts = await getCollection('posts', ({ data }) => {
  return data.published !== false;
});

// Sort by date (newest first)
posts.sort((a, b) => b.slug.localeCompare(a.slug));
```

### Rendering Content

```astro
---
const { post } = Astro.props;
const { Content } = await post.render();
---

<article>
  <h1>{post.data.title}</h1>
  <Content />
</article>
```

### Type Safety

Use `CollectionEntry` type for type-safe content:

```typescript
import type { CollectionEntry } from 'astro:content';

interface Props {
  post: CollectionEntry<'posts'>;
}
```

## Markdown Configuration

Markdown processing is configured in `astro.config.mjs`:

```javascript
markdown: {
  // Syntax highlighting with GitHub theme
  shikiConfig: {
    theme: 'github-light',
    wrap: true,
  },
  // Enable GitHub Flavored Markdown
  gfm: true,
  // Enable smartypants for typography
  smartypants: true,
}
```

### Remark and Rehype Plugins

You can add plugins for markdown processing:

```javascript
import remarkPlugin from 'remark-plugin';
import rehypePlugin from 'rehype-plugin';

export default defineConfig({
  markdown: {
    remarkPlugins: [remarkPlugin],
    rehypePlugins: [rehypePlugin],
  },
});
```

## File Organization

### Blog Posts

Place blog posts in `src/content/posts/`:

```
src/content/posts/
├── 2024-01-01-my-post.md        # Jekyll-style naming
├── example-markdown-post.md      # Or simple slugs
└── example-mdx-post.mdx         # MDX posts
```

### Pages

Place static pages in `src/content/pages/`:

```
src/content/pages/
├── about.md
├── example-page.md
└── contact.mdx
```

## Routes

### Dynamic Post Routes

Posts are rendered at `/posts/{slug}/` via `src/pages/posts/[slug].astro`.

### Custom Routes

Create custom routes in `src/pages/` to render content:

```astro
---
import { getEntry } from 'astro:content';

const page = await getEntry('pages', 'about');
const { Content } = await page.render();
---

<Layout>
  <Content />
</Layout>
```

## Best Practices

1. **Use Markdown for simple content**: Text-heavy posts work great in `.md`
2. **Use MDX for rich content**: When you need components, use `.mdx`
3. **Validate frontmatter**: Let the schema catch errors at build time
4. **Keep slugs clean**: Use descriptive, URL-friendly slugs
5. **Leverage components**: Create reusable MDX components for common patterns
6. **Test locally**: Run `npm run astro:build` to catch errors

## Migrating from Jekyll

To migrate Jekyll posts to Astro:

1. **Copy posts**: Move `.md` files from `_posts/` to `src/content/posts/`
2. **Update frontmatter**: Ensure required fields (`title`, `description`) are present
3. **Convert Liquid**: Replace Liquid tags with MDX components if needed
4. **Test build**: Run `npm run astro:build` to validate
5. **Update links**: Adjust internal links to match new URL structure

## Troubleshooting

### Build Errors

If the build fails with frontmatter errors:

1. Check `src/content/config.ts` for required fields
2. Ensure all posts have `title` and `description`
3. Run `npm run astro:check` for detailed errors

### Type Errors

If TypeScript complains:

1. Import `CollectionEntry` type: `import type { CollectionEntry } from 'astro:content';`
2. Use proper types for parameters: `({ data }: CollectionEntry<'posts'>)`
3. Run `npm run astro:check` to verify

### Content Not Appearing

If content doesn't show up:

1. Check `published` field (must not be `false`)
2. Verify file is in correct collection directory
3. Ensure frontmatter is valid YAML
4. Rebuild: `npm run astro:build`

## Resources

- [Astro Content Collections](https://docs.astro.build/en/guides/content-collections/)
- [Astro Markdown](https://docs.astro.build/en/guides/markdown-content/)
- [MDX in Astro](https://docs.astro.build/en/guides/integrations-guide/mdx/)
- [Zod Schema Validation](https://zod.dev/)
