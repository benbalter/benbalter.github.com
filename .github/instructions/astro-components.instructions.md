---
applyTo: ["src/**/*.astro", "src/**/*.ts", "!src/**/*.test.ts", "!src/**/*.spec.ts"]
---

# Astro Components and TypeScript Instructions

When working with Astro components and TypeScript utilities, follow these guidelines:

## Astro Component Structure

Astro components use a unique syntax with three sections:

```astro
---
// 1. Frontmatter (TypeScript)
import { getCollection } from 'astro:content';

interface Props {
  title: string;
  description?: string;
}

const { title, description } = Astro.props;
const posts = await getCollection('posts');
---

<!-- 2. Template (HTML with expressions) -->
<div class="component">
  <h1>{title}</h1>
  {description && <p>{description}</p>}
</div>

<!-- 3. Styles (Scoped CSS - use only when necessary) -->
<style>
.component {
  /* Custom styles not covered by Tailwind */
}
</style>
```

## Best Practices

### Zero JavaScript by Default

- **DO NOT** use `client:*` directives unless absolutely necessary
- Astro components are server-rendered by default (no JS shipped)
- Only add interactivity when required for user experience

```astro
<!-- ❌ BAD: Unnecessary client-side rendering -->
<Component client:load />

<!-- ✅ GOOD: Server-only component (default) -->
<Component />

<!-- ✅ GOOD: Client-side only when needed -->
<InteractiveWidget client:idle />
```

### TypeScript Props

- Define proper TypeScript interfaces for component props
- Use descriptive prop names
- Provide default values when appropriate
- Document complex props with JSDoc comments

```astro
---
/**
 * Card component for displaying post information
 */
interface Props {
  /** Post title */
  title: string;
  /** Optional post description */
  description?: string;
  /** Publication date */
  date: Date;
  /** Post URL */
  url: string;
}

const { title, description, date, url } = Astro.props;
---
```

### Content Collections

- Use Astro's content collections for type-safe content
- Import from `astro:content` module
- Leverage Zod schemas defined in `src/content/config.ts`
- Use `getCollection()` for fetching content
- Use `getEntry()` for single items

```astro
---
import { getCollection, getEntry } from 'astro:content';

// Get all posts
const allPosts = await getCollection('posts');

// Get a specific post
const post = await getEntry('posts', 'my-post-slug');

// Filter and sort
const publishedPosts = await getCollection('posts', ({ data }) => {
  return data.draft !== true;
});
---
```

## Component Guidelines

### Layout Components

- Place in `src/layouts/` directory
- Use `<slot />` for content insertion
- Include common page structure (head, navigation, footer)
- Accept props for customization (title, description, etc.)

```astro
---
// src/layouts/BaseLayout.astro
interface Props {
  title: string;
  description: string;
}

const { title, description } = Astro.props;
---

<!DOCTYPE html>
<html lang="en">
<head>
  <title>{title}</title>
  <meta name="description" content={description} />
</head>
<body>
  <slot />
</body>
</html>
```

### Page Components

- Place in `src/pages/` directory
- File-based routing: `src/pages/about.astro` → `/about/`
- Dynamic routes use brackets: `[slug].astro`
- Export `getStaticPaths()` for dynamic routes

```astro
---
// src/pages/[year]/[month]/[day]/[slug].astro
import { getCollection } from 'astro:content';

export async function getStaticPaths() {
  const posts = await getCollection('posts');
  
  return posts.map(post => ({
    params: {
      year: post.data.date.getFullYear().toString(),
      month: String(post.data.date.getMonth() + 1).padStart(2, '0'),
      day: String(post.data.date.getDate()).padStart(2, '0'),
      slug: post.slug
    },
    props: { post }
  }));
}

const { post } = Astro.props;
---
```

### Reusable Components

- Place in `src/components/` directory
- Keep components focused and single-purpose
- Use semantic HTML elements
- Ensure accessibility (ARIA labels, alt text, etc.)
- Follow existing naming conventions (PascalCase)

## TypeScript Utilities

### Utility Functions

- Place in `src/utils/` directory
- Write pure functions when possible
- Include JSDoc comments for complex logic
- Add unit tests in `.test.ts` files alongside source
- Export types and functions explicitly

```typescript
/**
 * Generates a URL slug from a title string
 * @param title - The title to convert to a slug
 * @returns URL-safe slug string
 */
export function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-');
}
```

### Testing

- Use Vitest for unit testing
- Place test files alongside source: `utility.ts` → `utility.test.ts`
- Test edge cases and error conditions
- Use descriptive test names

```typescript
import { describe, it, expect } from 'vitest';
import { generateSlug } from './slug';

describe('generateSlug', () => {
  it('converts title to lowercase slug', () => {
    expect(generateSlug('Hello World')).toBe('hello-world');
  });
  
  it('removes special characters', () => {
    expect(generateSlug('Hello, World!')).toBe('hello-world');
  });
});
```

## Styling

### Tailwind CSS Utilities (Preferred)

- Use Tailwind CSS utility classes directly in components
- This is the primary styling approach for the site
- Tailwind v4 is configured in `src/styles/global.css`
- Responsive utilities: `md:`, `lg:`, `xl:`, `2xl:`

```astro
<!-- ✅ GOOD: Use Tailwind utilities directly -->
<div class="p-4 bg-white border border-gray-200 rounded-lg">
  <h2 class="text-xl font-bold text-gray-900">Title</h2>
  <p class="text-gray-600">Description</p>
</div>

<!-- ✅ GOOD: Use custom component classes from global.css -->
<button class="btn btn-primary">
  Click Me
</button>
```

### Scoped Styles (Use Sparingly)

- Use `<style>` tag only for component-specific styles not covered by Tailwind
- Scoped styles only apply to that component
- Keep scoped styles minimal and focused

```astro
<style>
/* Only for custom styles that can't be done with Tailwind */
.custom-component {
  /* Unique styling specific to this component */
}
</style>
```

### Global Styles

- Main stylesheet: `src/styles/global.css` (Tailwind v4 + custom styles)
- Imported in `BaseLayout.astro`
- Custom components defined with `@layer components` in `global.css`
- CSS is inlined at build time for optimal performance

```astro
---
import '../styles/global.css';
---
```

## Performance

### Image Optimization

- Use Astro's `<Image>` component for local images
- Use `<Picture>` for art direction
- Specify `width` and `height` attributes
- Use appropriate formats (WebP, AVIF)

```astro
---
import { Image } from 'astro:assets';
import myImage from '../assets/image.png';
---

<Image src={myImage} alt="Description" width={800} height={600} />
```

### Content Loading

- Fetch data in component frontmatter (runs at build time)
- Avoid client-side data fetching
- Use `getCollection()` for efficient content queries
- Filter and transform data at build time

## Accessibility

- Use semantic HTML elements (`<article>`, `<nav>`, `<main>`, etc.)
- Include ARIA labels for interactive elements
- Provide alt text for all images
- Ensure keyboard navigation works
- Test with screen readers
- Respect `prefers-reduced-motion` for animations

## Running and Testing

```bash
npm run astro:dev         # Start dev server with hot reload
npm run astro:build       # Build for production
npm run astro:check       # Type-check TypeScript
npm run test:vitest       # Run unit tests
npm run test:e2e:astro    # Run E2E tests
```

## Common Patterns

### Fetching and Displaying Posts

```astro
---
import { getCollection } from 'astro:content';
import PostCard from '../components/PostCard.astro';

const posts = await getCollection('posts', ({ data }) => {
  return data.draft !== true;
});

const sortedPosts = posts.sort((a, b) => 
  b.data.date.getTime() - a.data.date.getTime()
);
---

<div class="post-list">
  {sortedPosts.map(post => (
    <PostCard post={post} />
  ))}
</div>
```

### Conditional Rendering

```astro
---
const showBanner = true;
const items = ['one', 'two', 'three'];
---

{showBanner && (
  <div class="banner">Welcome!</div>
)}

{items.length > 0 ? (
  <ul>
    {items.map(item => <li>{item}</li>)}
  </ul>
) : (
  <p>No items found</p>
)}
```

## Resources

- [Astro Documentation](https://docs.astro.build/)
- [Astro Content Collections](https://docs.astro.build/en/guides/content-collections/)
- [Astro Best Practices](../docs/ASTRO-BEST-PRACTICES.md)
- [Astro Architecture](../docs/ASTRO-ARCHITECTURE.md)

Remember: **Performance and accessibility first**. Keep components lightweight, semantic, and accessible.
