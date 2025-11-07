# Next.js Migration Implementation

This document describes the implementation of migrating blog posts from Jekyll to Next.js while keeping the rest of the site in Jekyll.

## Architecture

The site uses a **hybrid approach** combining Jekyll and Next.js:

### Jekyll (Site Structure)

* Homepage, about page, contact page, etc.
* Site layouts and templates
* Resume section
* Asset compilation (CSS, JS via webpack)
* RSS feeds and sitemaps

### Next.js (Blog Posts)

* All blog posts (184 posts)
* Dynamic routes at `/:year/:month/:day/:slug/`
* Blog index at `/blog/`
* Markdown parsing with gray-matter and remark
* Static HTML export

## File Structure

```
.
├── _posts/                    # Markdown blog posts (source)
├── lib/
│   ├── posts.ts              # Post reading/parsing utilities
│   └── markdown.ts           # Markdown to HTML conversion
├── app/
│   ├── [year]/[month]/[day]/[slug]/
│   │   └── page.tsx          # Dynamic post route
│   ├── blog/
│   │   └── page.tsx          # Blog index page
│   ├── layout.tsx            # Root layout
│   └── page.tsx              # Homepage placeholder
├── script/
│   └── build-combined        # Combined build script
├── next.config.mjs           # Next.js configuration
└── _site/                    # Final output (gitignored)
```

## Build Process

### Overview

The build process combines Jekyll and Next.js outputs into a single `_site/` directory suitable for GitHub Pages deployment.

### Steps

1. **Jekyll Build**

   ```bash
   bundle exec jekyll build
   ```

   * Builds site structure to `_site/`
   * Includes all pages, layouts, assets
   * Also builds posts (will be overwritten by Next.js)

2. **Next.js Build**

   ```bash
   npm run next:build
   ```

   * Builds posts to `.next-output/`
   * Generates static HTML for all 184 posts
   * Creates blog index page

3. **Merge Outputs**

   ```bash
   script/build-combined
   ```

   * Copies post directories (year folders) from `.next-output/` to `_site/`
   * Copies blog index directory
   * Copies Next.js runtime assets (`_next/`)
   * Result: Complete site in `_site/`

### Running the Build

```bash
# Combined build (recommended)
npm run build

# Individual builds
npm run build:jekyll    # Jekyll only
npm run build:next      # Next.js only
npm run build:webpack   # Webpack assets only
```

## Technical Details

### Post Parsing

Posts are read from `_posts/*.md` files:

```typescript
// File format: YYYY-MM-DD-slug.md
// Example: 2023-05-19-pull-requests-are-a-form-of-documentations.md

const post = getPostBySlug('2023', '05', '19', 'pull-requests-are-a-form-of-documentations');
// Returns: { title, description, date, slug, content, ...frontmatter }
```

### URL Structure

Next.js preserves Jekyll's URL structure:

* Jekyll: `/:year/:month/:day/:title/`
* Next.js: `/[year]/[month]/[day]/[slug]/` → Same output

Example: `/2023/05/19/pull-requests-are-a-form-of-documentations/`

### Static Site Generation

Next.js uses `generateStaticParams` to pre-render all posts at build time:

```typescript
export async function generateStaticParams() {
  const posts = getAllPostSlugs();
  return posts.map(post => post.params);
}
```

This generates 184 static HTML pages, one for each post.

## Security Considerations

### Trusted Content Source

All content comes from `_posts/` directory which is controlled by the site owner. This is a trusted source.

### XSS Prevention

* **Post content**: Uses `dangerouslySetInnerHTML` for markdown-to-HTML conversion
  * Justified because content is from trusted source
  * HTML sanitization is disabled to preserve formatting
* **Metadata** (title, description): Rendered as React text children
  * Automatically escaped by React
  * Safe from XSS

### Dependencies

* `gray-matter`: Parse YAML frontmatter
* `remark`: Markdown processing
* `remark-html`: HTML conversion
* `remark-gfm`: GitHub Flavored Markdown support

## Development

### Next.js Development Server

```bash
npm run dev
# Opens http://localhost:3000
# Shows Next.js posts only (not full Jekyll site)
```

### Jekyll Development Server

```bash
bundle exec rake serve
# Opens http://localhost:4000
# Shows full Jekyll site (with Jekyll-rendered posts)
```

## Deployment

The site is deployed to GitHub Pages from the `_site/` directory.

### GitHub Pages Compatibility

Next.js is configured for static export:

```javascript
// next.config.mjs
export default {
  output: 'export',           // Static HTML export
  images: { unoptimized: true }, // No image optimization
  trailingSlash: true,        // GitHub Pages requirement
  distDir: '.next-output',    // Separate output directory
};
```

### Deployment Process

1. Build the site: `npm run build`
2. Deploy `_site/` directory to GitHub Pages
3. GitHub Pages serves static files

## Future Enhancements

Potential improvements:

1. **Styling**: Add CSS to match Jekyll theme
2. **Components**: Create reusable React components for post layout
3. **Features**: Add search, filtering, tag pages
4. **Performance**: Optimize images with next/image when possible
5. **Analytics**: Add analytics tracking
6. **RSS**: Generate RSS feed from Next.js
7. **Sitemap**: Generate sitemap from Next.js

## Troubleshooting

### Jekyll Build Fails

If Jekyll build fails with GitHub metadata errors, ensure:

* `JEKYLL_GITHUB_TOKEN` or `GITHUB_TOKEN` is set
* Or use test config: `--config _config.yml,_config_test.yml`

### Next.js Build Fails

Check:

* All post files are valid markdown
* Frontmatter is valid YAML
* File names match format: `YYYY-MM-DD-slug.md`

### Posts Not Showing

Verify:

1. Posts exist in `_posts/` directory
2. Post filenames follow Jekyll convention
3. Frontmatter includes `title` and `description`
4. Build completed successfully

## Maintenance

### Adding New Posts

1. Create markdown file in `_posts/`:

   ```
   _posts/2024-01-15-my-new-post.md
   ```

2. Add frontmatter:

   ```yaml
   ---
   title: My New Post
   description: Brief description of the post
   ---

   Post content here...
   ```

3. Rebuild site: `npm run build`

### Updating Dependencies

```bash
# Update npm packages
npm update

# Update Ruby gems
bundle update

# Check for security vulnerabilities
npm audit
bundle audit
```
