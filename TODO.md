# Next.js Migration TODO

## Metadata Files with Liquid Syntax

These files currently use Jekyll's Liquid templating and need to be migrated to Next.js:

### Files to Migrate (in `public/` directory):

1. **press-feed.xml** (`public/press-feed.xml`)
   * RSS feed for press clips
   * Uses Liquid to iterate over `site.data.clips`
   * Has front matter with `permalink: /press/feed/index.xml`
   * Needs: Dynamic route or API endpoint to generate RSS feed from press data

2. **humans.txt** (`public/humans.txt`)
   * Credits file listing contributors
   * Uses Liquid to iterate over `site.github.contributors` and `site.github.versions`
   * Uses `site.time` for last updated date
   * Needs: Dynamic generation from GitHub API or static generation with build-time data

3. **robots.txt** (`public/robots.txt`)
   * Search engine crawler directives
   * Uses Liquid to iterate over `page.disallows` array
   * Has front matter defining disallow list
   * Needs: Static file generation during build or API route

4. **security.txt** (`public/security.txt`)
   * Security policy file (RFC 9116 compliant)
   * Uses Liquid variables: `site.email`, `site.repository`, `page.url`
   * Uses Liquid filters for date calculation and URL generation
   * Has front matter with `permalink: .well-known/security.txt`
   * Needs: Build-time generation with config values or API route

5. **llms.txt** (`public/llms.txt`)
   * LLM/AI assistant context file
   * Uses Liquid to include site description and other metadata
   * Needs: Static generation from config during build

6. **browserconfig.xml** (`public/browserconfig.xml`)
   * Windows tile configuration for pinned sites
   * Uses Liquid to generate tile image URL with build revision
   * Has front matter with `sitemap: false`
   * Needs: Build-time generation or simple static file with fixed paths

### Migration Strategy:

* **Option 1**: Generate these files statically during the Next.js build process
  * Use a build script in `script/` directory
  * Read data from `_config.yml` and other sources
  * Write static files to `public/` directory during build
  * Best for: `robots.txt`, `browserconfig.xml`, `llms.txt`

* **Option 2**: Create API routes to dynamically generate these files
  * Create routes in `app/api/` directory (e.g., `app/api/press-feed.xml/route.ts`)
  * Fetch data from config or GitHub API
  * Return appropriate content-type headers (e.g., `application/xml`, `text/plain`)
  * Best for: `press-feed.xml`, `humans.txt` (if using GitHub API)

* **Option 3**: Use Next.js middleware or server components
  * Intercept requests for these paths
  * Generate content on-demand
  * Cache responses appropriately
  * Alternative approach for any of the above files

### Recommended Approach by File:

* **browserconfig.xml**: Build-time generation - simple static file with config values
* **robots.txt**: Build-time generation - read disallow list from front matter or config
* **security.txt**: Build-time generation - use config values for email, repository, expiration date
* **llms.txt**: Build-time generation - static file with site description from config
* **humans.txt**: API route - fetch contributors from GitHub API dynamically
* **press-feed.xml**: API route or build-time generation from `_data/clips.yml`

### Implementation Notes:

1. **Build-time generation**: Create a `script/generate-metadata-files.mjs` script that:
   * Reads `_config.yml` for site metadata
   * Reads any necessary data files (e.g., `_data/clips.yml`)
   * Generates each file based on templates
   * Writes output to `public/` directory
   * Runs as part of the build process in package.json

2. **API routes**: For dynamic files, create routes like:
   ```typescript
   // app/api/press-feed.xml/route.ts
   export async function GET() {
     // Generate XML content
     return new Response(xml, {
       headers: { 'Content-Type': 'application/xml' }
     });
   }
   ```

3. **Front matter data**: The original files have front matter (e.g., permalinks). This needs to be handled differently:
   * For build-time generation: Store metadata in a separate config/data file
   * For API routes: Use Next.js routing to handle the permalink URLs

## Open Graph Images

The `/public/assets/images/og/` directory contains 184 Open Graph images for posts. These were excluded from the initial migration to reduce diff size.

### TODO:

* Copy OG images from Jekyll `assets/images/og/` to Next.js `public/assets/images/og/`
* Ensure post metadata correctly references OG images
* Verify images are accessible in production build
* Consider generating OG images dynamically using `@vercel/og` or similar

## Other Migration Tasks:

* Migrate any remaining Jekyll plugins to Next.js equivalents
* Set up RSS feed generation for blog posts
* Migrate sitemap generation logic
* Review and migrate any custom Jekyll filters or tags
