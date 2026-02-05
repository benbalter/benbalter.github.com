---
applyTo: ["src/styles/**/*.css", "src/**/*.astro"]
---

# Styles Instructions

When working with CSS and Astro component styles, follow these guidelines:

## Tailwind CSS v4 Architecture

* Site uses **Tailwind CSS v4** with `@tailwindcss/vite` plugin
* Main stylesheet: `src/styles/global.css`
* Configuration via CSS (`@theme` directive), not `tailwind.config.js`
* Uses `@tailwindcss/typography` plugin for prose styling
* Imported in `BaseLayout.astro` and inlined at build time

## Tailwind v4 Configuration

**Theme customization in `src/styles/global.css`:**

```css
@import "tailwindcss";
@plugin "@tailwindcss/typography";

@theme {
  --color-primary: #337ab7;
  --font-sans: -apple-system, BlinkMacSystemFont, "Segoe UI", ...;
}
```

**Key differences from v3:**
- No `tailwind.config.js` file
- Configuration lives in CSS using `@theme` directive
- Uses CSS custom properties for theming
- Integrated via Vite plugin instead of PostCSS

## Styling Approach

### Utility-First with Tailwind

**Prefer Tailwind utilities in Astro components:**

```astro
<!-- ✅ GOOD: Use Tailwind utility classes -->
<div class="p-4 bg-white border border-gray-200 rounded-lg">
  <h2 class="text-xl font-bold text-gray-900">Title</h2>
  <p class="text-gray-600">Description</p>
</div>

<!-- ❌ BAD: Custom CSS for common patterns -->
<style>
  .my-card {
    padding: 1rem;
    background: white;
    border: 1px solid #e5e7eb;
    border-radius: 0.5rem;
  }
</style>
```

### Custom Components in Global CSS

**For reusable patterns, use `@layer components` in `global.css`:**

```css
@layer components {
  .btn {
    @apply inline-flex items-center px-4 py-2 rounded font-medium;
    @apply min-h-[44px];
  }
  
  .btn-primary {
    @apply bg-primary text-white border border-primary;
  }
}
```

### Scoped Styles in Astro Components

**Use `<style>` tags for component-specific styles:**

```astro
---
// Component logic
---
<div class="custom-component">
  <slot />
</div>

<style>
  /* Scoped to this component only */
  .custom-component {
    /* Custom styles not covered by Tailwind */
  }
</style>
```

## Responsive Design

* **Mobile-first approach**: Tailwind utilities are mobile-first by default
* Use responsive prefixes: `md:`, `lg:`, `xl:`, `2xl:`
* Test at multiple breakpoints (mobile, tablet, desktop)
* Ensure touch targets are at least 44x44px

```astro
<!-- Mobile-first responsive example -->
<div class="px-4 md:px-6 lg:px-8">
  <h1 class="text-2xl md:text-3xl lg:text-4xl">Heading</h1>
</div>
```

## CSS Best Practices

### Naming Conventions

* Use Tailwind utilities first
* For custom classes: kebab-case (`.my-component`)
* Keep class names descriptive and semantic
* Avoid overly specific selectors

### Specificity

* Tailwind utilities have consistent low specificity
* Avoid using `!important` (use Tailwind's `!` prefix if needed)
* Keep custom selectors shallow (max 2-3 levels)
* Use `@apply` in custom components for consistency

### Performance

* CSS is inlined at build time (`inlineStylesheets: 'always'`)
* Tailwind purges unused utilities automatically
* Use `contain` CSS property for large content areas
* Optimize with `content-visibility: auto` for off-screen content

## Dark Mode Support

* Site uses `prefers-color-scheme` media query
* Dark mode configured in `global.css` with CSS custom properties
* Test both light and dark modes
* Ensure WCAG AA contrast ratios in both modes

```css
/* Light mode (default) */
body {
  @apply text-gray-900 bg-white;
}

/* Dark mode */
@media (prefers-color-scheme: dark) {
  body {
    @apply text-gray-100 bg-gray-900;
  }
}
```

## Accessibility

* Ensure sufficient color contrast (WCAG AA: 4.5:1 normal text, 3:1 large text)
* Don't rely solely on color to convey information
* Respect user preferences (`prefers-reduced-motion`, `prefers-color-scheme`)
* Make focus states visible and clear
* Use semantic HTML with proper ARIA attributes

## Common Patterns

### Button Styling

```astro
<!-- Use custom .btn classes from global.css -->
<a href="/contact" class="btn btn-primary">
  Contact Me
</a>

<!-- Or use Tailwind utilities directly -->
<button class="px-4 py-2 bg-primary text-white rounded hover:bg-primary-600">
  Click Me
</button>
```

### Card Components

```astro
<div class="bg-white border border-gray-200 rounded-lg p-6">
  <h3 class="text-xl font-bold mb-2">Card Title</h3>
  <p class="text-gray-600">Card content</p>
</div>
```

### Responsive Grid

```astro
<div class="container mx-auto px-4">
  <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
    <!-- Grid items -->
  </div>
</div>
```

## Typography Plugin

* Uses `@tailwindcss/typography` for prose styling
* Apply `.prose` class to content areas
* Custom prose theme: `.prose-primary` (defined in `global.css`)

```astro
<article class="prose prose-primary lg:prose-lg mx-auto">
  <!-- Markdown content renders with beautiful typography -->
</article>
```

## Testing Styles

```bash
npm run dev              # Start Astro dev server with hot reload
npm run build            # Build site (includes CSS processing)
npm run preview          # Preview production build
```

## Browser Support

* Modern browsers (last 2 versions)
* Autoprefixer runs automatically via PostCSS
* Test critical pages in Chrome, Firefox, Safari, Edge
* Graceful degradation for older browsers

## Resources

* [Tailwind CSS v4 Documentation](https://tailwindcss.com/docs)
* [Tailwind Typography Plugin](https://tailwindcss.com/docs/typography-plugin)
* [Astro Styling Guide](https://docs.astro.build/en/guides/styling/)

Remember: Use **Tailwind utilities first**, then custom components in `global.css` via `@layer`, and scoped `<style>` tags only when necessary. Keep styles **maintainable, performant, and accessible**.
