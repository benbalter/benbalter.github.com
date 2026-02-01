# Astro Implementation

This directory contains an Astro-based implementation of Ben Balter's personal website, designed to coexist with the existing Jekyll implementation during development.

## Quick Start

### Development

Start the Astro development server:

```bash
npm run astro:dev
```

This will start the server at `http://localhost:4321` (different from Jekyll's 4000).

### Build

Build the site for production:

```bash
npm run astro:build
```

The built site will be output to `dist-astro/` directory.

### Preview

Preview the production build locally:

```bash
npm run astro:preview
```

## Project Structure

```
├── src/
│   ├── pages/          # Page components (become routes)
│   │   ├── index.astro # Homepage (/)
│   │   ├── about.astro # About page (/about/)
│   │   └── resume.astro # Resume page (/resume/)
│   ├── layouts/        # Layout components
│   │   └── BaseLayout.astro
│   └── components/     # Reusable components
├── public/             # Static assets (copied to dist-astro/)
├── astro.config.mjs    # Astro configuration
└── tsconfig.astro.json # TypeScript config for Astro
```

## Configuration

### Output Directory

The Astro build outputs to `dist-astro/` to avoid conflicts with:

- Jekyll: `_site/`

### Development Server

Astro runs on port 4321 to avoid conflicts with:

- Jekyll: port 4000

### GitHub Pages Compatibility

The configuration is optimized for GitHub Pages deployment:

- **Static output**: All pages pre-rendered at build time
- **Trailing slashes**: Enabled for consistent URLs
- **Directory format**: Creates index.html files in directories
- **Base URL**: Configured for ben.balter.com domain

## Features

### Performance

- **Zero JavaScript by default**: Only ship JS when needed
- **Optimized assets**: Automatic image optimization and bundling
- **Fast builds**: Vite-powered build system
- **View Transitions**: Smooth page navigation using [Astro View Transitions](https://docs.astro.build/en/guides/view-transitions/)
  - **JavaScript-based routing**: Astro's ClientRouter intercepts link clicks for smooth transitions
  - **CSS View Transitions API styling**: Uses modern browser APIs for animation effects (Chrome/Edge 126+)
  - **Hover-based prefetching**: Links are prefetched on hover to balance speed with bandwidth
  - **Persistent elements**: Navigation and footer persist across page changes without re-rendering
  - **Semantic animations**: Smooth transitions for main content while keeping UI elements stable
  - **Accessibility**: Respects `prefers-reduced-motion` preference
  - See [View Transitions Optimization](#view-transitions-optimization) section below for details

### Developer Experience

- **Hot Module Reloading**: Instant feedback during development
- **TypeScript support**: Type-safe component development
- **Component Islands**: Partial hydration for interactive components

### SEO & Accessibility

- **Semantic HTML**: Accessible markup by default
- **Meta tags**: SEO-friendly metadata
- **Fast loading**: Excellent Core Web Vitals

### View Transitions Optimization

The site uses [Astro View Transitions](https://docs.astro.build/en/guides/view-transitions/) as an experimental approach to enhance page navigation with smooth animations.

**Implementation:**

1. **View Transition Styling for Astro's Router**
   ```css
   /* src/styles/optimized.scss */
   @view-transition {
       navigation: auto;
   }
   ```
   - Styles Astro's JavaScript-driven View Transitions using the native CSS View Transitions API (Chrome/Edge 126+)
   - Astro's ClientRouter (JavaScript) handles link interception and page transitions
   - Graceful fallback to non-animated navigation when View Transitions are not supported

2. **Semantic Animations**
   ```css
   .content {
       view-transition-name: main-content;
   }
   ```
   - Main content smoothly transitions between pages
   - Hero unit view-transition-name removed to avoid conflicts (only exists on homepage)

3. **Persistent Elements with Active State Updates**
   ```astro
   // Navigation uses transition:persist with client-side active state management
   <nav transition:persist="nav">
     <script>
       // Update active nav link state on page transitions
       document.addEventListener('astro:page-load', () => {
         // Update active class based on current URL
       });
     </script>
   </nav>
   <footer transition:persist>...</footer>
   ```
   - Navigation and footer don't re-render on page changes
   - JavaScript updates active link highlighting after navigation
   - Improves perceived performance and prevents layout shift

4. **Hover-Based Prefetching**
   ```js
   // astro.config.mjs
   prefetch: {
     prefetchAll: false,
     defaultStrategy: 'hover',
   }
   ```
   - Links are prefetched when users hover over them (indicating intent)
   - Balances navigation speed with bandwidth usage
   - Better for users on slower connections or mobile data

5. **Accessibility Support**
   ```css
   @media (prefers-reduced-motion: reduce) {
       @view-transition {
           navigation: none;
       }
       ::view-transition-group(*),
       ::view-transition-old(*),
       ::view-transition-new(*) {
           animation: none !important;
       }
   }
   ```
   - Respects user's motion preferences
   - Disables all view transition animations for accessibility
   - Falls back to instant navigation

**Benefits:**

- **Smooth UX**: No white flashes or jarring page reloads
- **Intent-based prefetching**: Hover strategy balances speed with bandwidth usage
- **Better performance**: Persistent elements don't re-render
- **Accessible**: Respects `prefers-reduced-motion` preference
- **Progressive enhancement**: Works in all browsers with appropriate fallbacks

**How it works:**

- Astro's ClientRouter (JavaScript) intercepts link clicks
- Instead of full page reloads, Astro fetches new pages and smoothly transitions
- CSS View Transition API provides animation styling when supported
- Browser history, scroll position, and page titles are managed automatically
- Links are prefetched on hover for faster navigation

**Implementation in BaseLayout:**

```astro
// src/layouts/BaseLayout.astro
import { ClientRouter } from 'astro:transitions';

<head>
  <!-- ... other head elements ... -->
  <ClientRouter />
</head>
```

The `ClientRouter` component is included in `BaseLayout.astro` and automatically enables View Transitions. Note: `ClientRouter` is the current name for View Transitions in Astro 5.x (previously called `ViewTransitions`).

**Disabling View Transitions for specific links:**

```html
<a href="/page/" data-astro-reload>Normal navigation</a>
```

**Testing:**

E2E tests for View Transitions are in `e2e/view-transitions.spec.ts` covering:

- Link interception and navigation
- Browser history management
- Scroll position preservation
- External link handling
- View Transitions configuration
- Accessibility (prefers-reduced-motion)

## Integration with Existing Code

### Coexistence Strategy

This Astro implementation is designed to run alongside Jekyll:

1. **Separate build outputs**: Each framework builds to its own directory
2. **Different ports**: Development servers run on different ports
3. **Independent dependencies**: Astro deps don't interfere with others
4. **Shared content**: Can potentially share markdown files and data

### Using Existing Content

Astro can potentially leverage existing content from the repository:

- `_posts/`: Blog posts (markdown files)
- `_data/`: YAML data files
- `_resume_positions/`: Resume data
- `public/`: Static assets

## Key Differences from Jekyll

### vs Jekyll

- **Modern tooling**: Vite-based instead of Ruby-based
- **Component-based**: Component architecture instead of Liquid templates
- **Zero JS**: No JavaScript by default, unlike Jekyll's asset pipeline

## Deployment Options

### Option 1: Separate Deployment

Deploy Astro build (`dist-astro/`) to a different subdomain or path:

- Main site: `ben.balter.com` (Jekyll)
- Astro: `astro.ben.balter.com` or `ben.balter.com/astro/`

### Option 2: A/B Testing

Use GitHub Pages or Netlify deploy previews to compare implementations.

### Option 3: Full Migration

Once development is complete, replace Jekyll with Astro:

1. Update GitHub Pages deployment to use `dist-astro/`
2. Archive Jekyll implementation
3. Update documentation

## Next Steps

### Content Migration

- [ ] Migrate blog posts from `_posts/` to Astro content collections
- [x] Configure Markdown and MDX support with @astrojs/mdx integration
- [x] Define content collections with frontmatter schemas
- [x] Create example Markdown and MDX posts
- [x] Add reusable MDX components (Callout, CodeBlock, YouTube)
- [ ] Migrate blog posts from `_posts/` to `src/content/posts/`
- [ ] Migrate resume data from `_resume_positions/`
- [ ] Migrate data files from `_data/`
- [ ] Add custom static assets to `public/`

See [docs/ASTRO_CONTENT.md](ASTRO_CONTENT.md) for detailed documentation on working with Markdown and MDX content.

### Feature Parity

- [ ] Implement blog post listing and pagination
- [ ] Add RSS feed generation
- [ ] Add sitemap generation
- [ ] Implement related posts functionality
- [ ] Add search functionality
- [ ] Migrate comments system

### Optimization

- [ ] Add image optimization for blog posts
- [ ] Implement partial hydration for interactive components
- [x] Add view transitions for smooth navigation
- [ ] Optimize bundle size with code splitting

### Testing

- [ ] Add Playwright E2E tests for Astro build
- [ ] Add component tests
- [ ] Test deployment to GitHub Pages
- [ ] Performance testing and optimization

## Documentation

- [Astro Documentation](https://docs.astro.build)
- [Astro GitHub](https://github.com/withastro/astro)
- [Astro Discord](https://astro.build/chat)

## Contributing

This is an experimental implementation. Feedback and contributions welcome!
