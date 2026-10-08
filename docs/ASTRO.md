# Astro Implementation

This directory contains documentation for Ben Balter's personal website, which is built with Astro. The site has been fully migrated from Jekyll to Astro.

## Quick Start

### Development

Start the Astro development server:

```bash
npm run dev
```

This will start the server at `http://localhost:4321`.

### Build

Build the site for production:

```bash
npm run build
```

The built site will be output to `dist-astro/` directory.

### Preview

Preview the production build locally:

```bash
npm run preview
```

## Project Structure

```text
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

The Astro build outputs to `dist-astro/` directory.

### Development Server

Astro runs on port 4321 by default.

### Cloudflare Workers Compatibility

The configuration is optimized for Cloudflare Workers Static Assets:

- **Static output**: All pages pre-rendered at build time
- **Trailing slashes**: Enabled for consistent URLs
- **Directory format**: Creates index.html files in directories
- **Base URL**: Configured for ben.balter.com domain

## Features

### Performance

- **Zero JavaScript by default**: Only ship JS when needed
- **Optimized assets**: Automatic image optimization and bundling
- **Fast builds**: Vite-powered build system
- **View Transitions**: Cross-document (multi-page) view transitions in CSS; no client-side router
  - Every navigation is a normal page load; `@view-transition { navigation: auto; }` animates it in browsers that support it
  - Post cards morph into the article headline via [`view-transition-cards.ts`](../src/scripts/view-transition-cards.ts)
  - **Hover-based prefetching**: Links are prefetched on hover to balance speed with bandwidth
  - **Accessibility**: Respects `prefers-reduced-motion` preference
  - See [View Transitions](#view-transitions) below for details

### Developer Experience

- **Hot Module Reloading**: Instant feedback during development
- **TypeScript support**: Type-safe component development
- **Component Islands**: Partial hydration for interactive components

### SEO & Accessibility

- **Semantic HTML**: Accessible markup by default
- **Meta tags**: SEO-friendly metadata
- **Fast loading**: Excellent Core Web Vitals

### View Transitions

The site is a plain multi-page app. It does **not** use Astro's `<ClientRouter />`: every navigation is a real page load, and the browser's cross-document View Transitions API animates it where supported. Browsers without support just navigate normally. Don't add `ClientRouter`; the `astro:page-load` and `astro:after-swap` events it provides never fire here, so client scripts initialize with [`onPageLoad()`](../src/scripts/on-page-load.ts) (a `DOMContentLoaded` wrapper) instead.

**Implementation:**

1. **Opt in with CSS** (`src/styles/global.css`):

   ```css
   @view-transition {
     navigation: auto;
   }
   ```

   Unnamed content cross-fades as `root`. Only elements that should stay put or morph get a `view-transition-name`, such as `.navbar` (`site-header`). Naming large, variable-height containers makes them stretch between pages, which is why `.content` is no longer named.

2. **Card → article morph.** Each article `<h1>` carries a static `view-transition-name` derived from its path ([`view-transition-name.ts`](../src/utils/view-transition-name.ts)). On `pageswap`, [`view-transition-cards.ts`](../src/scripts/view-transition-cards.ts) names only the one card that links to the destination, so a page that lists the same post twice never has duplicate names (which would abort the transition).

3. **Hover-based prefetching** (`astro.config.mjs`): `prefetchAll` stays off because Cloudflare refuses speculative prefetch for Worker-served requests.

4. **Reduced motion:** under `prefers-reduced-motion: reduce`, navigation transitions and animations are turned off.

**Testing:** [`e2e/view-transitions.spec.ts`](../e2e/view-transitions.spec.ts) covers navigation, history and scroll restoration, cross-page anchors, the card → article morph, and reduced motion.

## Integration with Content

### Content Structure

The site uses Astro's content collections to organize content:

- `src/content/posts/`: Blog posts (Markdown files)
- `src/data/`: YAML data files
- `src/content/resume-positions/`: Resume positions (content collection)
- `public/`: Static assets

## Key Differences from Jekyll

The site has been fully migrated from Jekyll to Astro. Key differences include:

- **Modern tooling**: Vite-based build system instead of Ruby-based
- **Component-based**: Component architecture instead of Liquid templates
- **Zero JS by default**: No JavaScript shipped by default, with opt-in client-side interactivity
- **TypeScript support**: Type-safe component development
- **Content Collections**: Structured content with TypeScript schemas instead of Jekyll collections

## Deployment

The site is deployed to Cloudflare Workers (static assets) using GitHub Actions and Wrangler. The deployment workflow builds the Astro site and publishes the `dist-astro/` directory to the `benbalter-github-com` Worker.

## Migration Status

The migration from Jekyll to Astro is complete. The following have been migrated:

- [x] Blog posts from Jekyll `_posts/` to `src/content/posts/`
- [x] Configure Markdown and MDX support with @astrojs/mdx integration
- [x] Define content collections with frontmatter schemas
- [x] Add reusable MDX components (Callout, CodeBlock, YouTube)
- [x] Resume data from `_resume_positions/`
- [x] Data files from `_data/` to `src/data/`
- [x] Static assets in `public/`
- [x] Layouts and templates from Jekyll to Astro components
- [x] RSS feed generation
- [x] Sitemap generation
- [x] View transitions for smooth navigation
- [x] Deployment to Cloudflare Workers

See [docs/ASTRO_CONTENT.md](ASTRO_CONTENT.md) for detailed documentation on working with Markdown and MDX content.

## Documentation

- [Astro Documentation](https://docs.astro.build)
- [Astro GitHub](https://github.com/withastro/astro)
- [Astro Discord](https://astro.build/chat)

## Contributing

This is an experimental implementation. Feedback and contributions welcome!
