# Next.js Migration TODO

## Metadata Files with Liquid Syntax

These files currently use Jekyll's Liquid templating and need to be migrated to Next.js:

### Files to Migrate:

1. **press-feed.xml** (`/press-feed.xml`)
   - RSS feed for press clips
   - Uses Liquid to iterate over `site.data.clips`
   - Needs: Dynamic route or API endpoint to generate RSS feed from press data

2. **humans.txt** (`/humans.txt`)
   - Credits file listing contributors
   - Uses Liquid to iterate over `site.github.contributors` and `site.github.versions`
   - Needs: Dynamic generation from GitHub API or static generation with build-time data

3. **robots.txt** (`/robots.txt`)
   - Search engine crawler directives
   - Uses Liquid to iterate over `page.disallows` array
   - Needs: Static file generation during build or API route

4. **security.txt** (`/security.txt`)
   - Security policy file
   - Likely contains Liquid variables
   - Needs: Check file and migrate to static or dynamic generation

5. **llms.txt** (`/llms.txt`)
   - LLM/AI assistant context
   - May contain Liquid variables
   - Needs: Review and migrate as needed

### Migration Strategy:

- **Option 1**: Generate these files statically during the Next.js build process
  - Use a build script in `script/` directory
  - Read data from `_config.yml` and other sources
  - Write static files to `public/` directory

- **Option 2**: Create API routes to dynamically generate these files
  - Create routes in `app/api/` directory
  - Fetch data from config or GitHub API
  - Return appropriate content-type headers

- **Option 3**: Use Next.js middleware or server components
  - Intercept requests for these paths
  - Generate content on-demand
  - Cache responses appropriately

### Recommended Approach:

For `robots.txt` and `security.txt`: Use static files in `public/` with build-time generation
For `press-feed.xml` and `humans.txt`: Use API routes for dynamic generation
For `llms.txt`: Likely can be static in `public/`

## Open Graph Images

The `/public/assets/images/og/` directory contains 184 Open Graph images for posts. These were excluded from the initial migration to reduce diff size.

### TODO:
- Copy OG images from Jekyll `assets/images/og/` to Next.js `public/assets/images/og/`
- Ensure post metadata correctly references OG images
- Verify images are accessible in production build
- Consider generating OG images dynamically using `@vercel/og` or similar

## Other Migration Tasks:

- Migrate any remaining Jekyll plugins to Next.js equivalents
- Set up RSS feed generation for blog posts
- Migrate sitemap generation logic
- Review and migrate any custom Jekyll filters or tags
