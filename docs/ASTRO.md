# Astro Implementation

This directory contains an Astro-based implementation of Ben Balter's personal website, designed to coexist with the existing Jekyll and Next.js implementations during development.

## Quick Start

### Development

Start the Astro development server:

```bash
npm run astro:dev
```

This will start the server at `http://localhost:4321` (different from Jekyll's 4000 and Next.js's 3000).

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
├── public/             # Static assets (shared with Next.js, copied to dist-astro/)
├── astro.config.mjs    # Astro configuration
└── tsconfig.astro.json # TypeScript config for Astro
```

## Configuration

### Output Directory

The Astro build outputs to `dist-astro/` to avoid conflicts with:
- Jekyll: `_site/`
- Next.js: `out/`

### Development Server

Astro runs on port 4321 to avoid conflicts with:
- Jekyll: port 4000
- Next.js: port 3000

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

### Developer Experience

- **Hot Module Reloading**: Instant feedback during development
- **TypeScript support**: Type-safe component development
- **Component Islands**: Partial hydration for interactive components

### SEO & Accessibility

- **Semantic HTML**: Accessible markup by default
- **Meta tags**: SEO-friendly metadata
- **Fast loading**: Excellent Core Web Vitals

## Integration with Existing Code

### Coexistence Strategy

This Astro implementation is designed to run alongside Jekyll and Next.js:

1. **Separate build outputs**: Each framework builds to its own directory
2. **Different ports**: Development servers run on different ports
3. **Independent dependencies**: Astro deps don't interfere with others
4. **Shared content**: Can potentially share markdown files and data

### Using Existing Content

Astro can potentially leverage existing content from the repository:

- `_posts/`: Blog posts (markdown files)
- `_data/`: YAML data files
- `_resume_positions/`: Resume data
- `public/`: Static assets (shared with Next.js)

## Key Differences from Jekyll/Next.js

### vs Jekyll

- **Modern tooling**: Vite-based instead of Ruby-based
- **Component-based**: Component architecture instead of Liquid templates
- **Zero JS**: No JavaScript by default, unlike Jekyll's asset pipeline

### vs Next.js

- **Simpler**: No React, no complex server/client component split
- **Faster builds**: Lighter-weight than Next.js for static sites
- **Multi-framework**: Can mix React, Vue, Svelte if needed

## Deployment Options

### Option 1: Separate Deployment

Deploy Astro build (`dist-astro/`) to a different subdomain or path:
- Main site: `ben.balter.com` (Jekyll/Next.js)
- Astro: `astro.ben.balter.com` or `ben.balter.com/astro/`

### Option 2: A/B Testing

Use GitHub Pages or Netlify deploy previews to compare implementations.

### Option 3: Full Migration

Once development is complete, replace Jekyll/Next.js with Astro:
1. Update GitHub Pages deployment to use `dist-astro/`
2. Archive Jekyll and Next.js implementations
3. Update documentation

## Next Steps

### Content Migration

- [ ] Migrate blog posts from `_posts/` to Astro content collections
- [ ] Migrate resume data from `_resume_positions/`
- [ ] Migrate data files from `_data/`
- [ ] Add custom static assets to `public/` (shared with Next.js)

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
- [ ] Add view transitions for smooth navigation
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
