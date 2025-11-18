---
applyTo: "app/**/*.{ts,tsx,js,jsx}"
---

# Next.js Application Instructions

This site is transitioning to Next.js with a **Static Site Generation (SSG) first** approach.

## CRITICAL: Server Components First

**ALL components should be server components by default** (no 'use client' directive).

### When to Use 'use client' (RARE CASES ONLY)

Use 'use client' ONLY when you need:

1. **React Hooks**: `useState`, `useEffect`, `useContext`, `usePathname`, etc.
2. **Browser APIs**: `window`, `document`, `localStorage`, `sessionStorage`
3. **Event Handlers with State**: Click handlers that update component state
4. **Third-Party Libraries**: Libraries that require browser environment

### When NOT to Use 'use client'

* ❌ **Navigation Links**: Use `<Link>` from 'next/link' in server components
* ❌ **Data Display**: Fetch data in server components, pass as props
* ❌ **Markdown Rendering**: Process markdown at build time in server components
* ❌ **Metadata/SEO**: Use `generateMetadata` function in server components
* ❌ **Styling/Layouts**: CSS and HTML work in server components
* ❌ **Static Content**: All static content should be in server components

### Before Adding 'use client', Ask

1. Can this be pure HTML/CSS?
2. Can this be a server component with no interactivity?
3. Can the parent be a server component and only a small child be a client component?
4. Is the client-side JavaScript absolutely necessary?

## Current Client Components (Only 2)

1. **ClientScripts.tsx**: Initializes Bootstrap and FontAwesome (requires `useEffect`)
2. **Navigation.tsx**: Active link highlighting (requires `usePathname` hook)

**Do NOT add more client components without strong justification.**

## Architecture Guidelines

### Good Architecture Example

```typescript
// app/posts/[slug]/page.tsx - Server Component (no 'use client')
export default async function PostPage({ params }) {
  const post = await getPost(params.slug);
  return (
    <article>
      <PostContent content={post.content} />
      <NavigationLinks /> {/* Tiny client component */}
    </article>
  );
}

// app/components/NavigationLinks.tsx - Small client component
'use client';
import { usePathname } from 'next/navigation';
export default function NavigationLinks() {
  const pathname = usePathname();
  // Only uses hook for active state
}
```

## Static Site Generation

* **All pages must be pre-rendered** at build time
* Use `output: 'export'` in `next.config.mjs` for GitHub Pages compatibility
* No dynamic routes unless statically generated with `generateStaticParams`
* Minimize JavaScript bundle size

## TypeScript

* Use TypeScript for type safety
* Define proper types for props and return values
* Avoid `any` types
* Use interfaces for component props

## Testing Next.js Code

```bash
npm run next:build    # Build Next.js site
npm run next:export   # Export as static HTML
npm test              # Run linters
```

## Performance Priorities

1. Minimize client-side JavaScript
2. Maximize server component usage
3. Pre-render all pages as static HTML
4. Optimize images and assets
5. Keep bundle sizes small

Remember: This site prioritizes **performance and static generation** over client-side interactivity. When in doubt, use server components.
