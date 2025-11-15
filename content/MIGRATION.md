# Jekyll to Next.js Content Migration Documentation

## Overview

This document describes the migration of all Jekyll content to Next.js-compatible Markdown files. All content has been reorganized into the `/content` directory with a structure suitable for Next.js static site generation.

## Migration Summary

### Content Migrated

* **Blog Posts**: 184 posts from `_posts/` → `content/posts/`
* **Pages**: 9 pages from root directory → `content/pages/`
* **Data Files**: 3 YAML files from `_data/` → `content/data/`
* **Resume Positions**: 10 collection items from `_resume_positions/` → `content/resume/`

**Total Files**: 206 files migrated

## Directory Structure

```
content/
├── posts/          # Blog posts (YYYY-MM-DD-title.md format)
├── pages/          # Site pages (about, contact, resume, etc.)
├── data/           # Data files (books.yml, clips.yml, related_posts.yml)
└── resume/         # Resume position entries
```

## Frontmatter Changes

### Blog Posts

#### Preserved Fields

* `title` - Post title
* `description` - Post description
* `image` - Featured image URL
* `date` - Extracted from filename (YYYY-MM-DD)
* `comments` - Comments setting
* `published` - Published status
* Custom fields (varies by post)

#### Converted Fields (prefixed with `_legacy_`)

* `layout` → `_legacy_layout` - Jekyll layout reference
* `permalink` → `_legacy_permalink` - Jekyll permalink
* `redirect_from` → `_legacy_redirect_from` - Jekyll redirect plugin
* `seo` → `_legacy_seo` - Jekyll SEO plugin fields

### Pages

#### Preserved Fields

* `title` - Page title
* `description` - Page description
* `published` - Published status
* `id` - Page identifier
* Custom fields (icons, seo, etc.)

#### Converted Fields (prefixed with `_legacy_`)

* `layout` → `_legacy_layout`
* `permalink` → `_legacy_permalink`

### Resume Positions

All frontmatter fields preserved as-is (no Jekyll-specific fields):

* `employer`
* `title`
* `start_date`
* `end_date`

### Data Files

Data files (YAML) copied as-is - no changes needed.

## Jekyll-Specific Features Found

### Liquid Template Tags

28 posts contain Liquid template tags that will need replacement in Next.js:

* `{% include_cached %}` - Component includes with caching
* `{% include %}` - Component includes
* `{% capture %}` / `{% endcapture %}` - Variable capture
* `{% for %}` / `{% endfor %}` - Loops
* Liquid filters: `markdownify`, `strip_html`, `absolute_url`

**Affected Posts**: See `content/posts/` for posts with Liquid tags (documented in original findings).

### Jekyll Redirects

12 posts use `redirect_from` frontmatter (Jekyll redirect plugin). These have been preserved as `_legacy_redirect_from` and will need alternative implementation:

* 2011–08–29-wp-document-revisions-document-management-version-control-wordpress.md
* 2011–11–29-towards-a-more-agile-government.md
* 2013–02–04-what-is-a-hacker.md
* 2014–01–27-open-collaboration.md
* 2014–09–29-our-code-deserves-better.md
* 2014–09–29-source-disclosed-is-not-the-same-as-open-source.md
* 2014–10–08-why-government-contractors-should-embrace-open-source.md
* 2014–11–06-rules-of-communicating-at-github.md
* 2014–11–24-open-source-policy.md
* 2015–02–20-jekyll-collections.md
* 2015–12–08-types-of-pull-requests.md
* 2016–10–31-eight-things-i-wish-i-knew-my-first-week-at-github.md
* 2020–08–31-trust-and-safety-features-to-build-into-your-product-before-someone-gets-hurt.md
* 2021–03–26-nine-things-a-technical-program-manager-does.md
* 2021–06–15-how-to-moderate-open-source-conversations-to-keep-them-productive.md
* 2023–12–08-cathedral-bazaar-management.md

## Required Next.js Implementation

### 1. Content Reading

Next.js will need utilities to:

* Read Markdown files from the `content/` directory
* Parse frontmatter (using libraries like `gray-matter`)
* Render Markdown to HTML (using libraries like `remark` or `marked`)

### 2. URL Routing

Next.js should implement routes matching Jekyll's permalink structure:

* Blog posts: `/YYYY/MM/DD/title/`
* Pages: Use `_legacy_permalink` or map to new paths
* Handle redirects from `_legacy_redirect_from` fields

### 3. Component Replacements

Replace Liquid includes with React components:

* `{% include_cached github-culture.html %}` → React component
* `{% include callout.html %}` → React component
* `{% include foss-at-scale.html %}` → React component

### 4. Data Loading

Load YAML data files:

* `content/data/books.yml` - Book recommendations
* `content/data/clips.yml` - Press clips
* `content/data/related_posts.yml` - Related posts mapping

Use libraries like `js-yaml` to parse YAML in Next.js.

### 5. Collections

Implement collection-like behavior:

* Resume positions collection (`content/resume/`)
* Sort by `start_date` and `end_date`
* Display in reverse chronological order

## Edge Cases and Considerations

### 1. HTML Pages

Two HTML pages were migrated:

* `index.html` - Homepage
* `other-recommended-reading.html` - Recommendations page

These may need conversion to Markdown or React components.

### 2. Liquid Filters

Posts use Liquid filters that need JavaScript equivalents:

* `markdownify` - Convert Markdown to HTML
* `strip_html` - Remove HTML tags
* `absolute_url` - Convert relative to absolute URLs
* `truncate` - Truncate text

### 3. Jekyll Plugins

Features provided by Jekyll plugins need alternative implementation:

* `jekyll-feed` - RSS feed generation
* `jekyll-sitemap` - Sitemap generation
* `jekyll-seo-tag` - SEO meta tags
* `jekyll-og-image` - Open Graph images
* `jekyll-mentions` - GitHub @mentions
* `jemoji` - GitHub emoji support

### 4. Date Handling

Blog post dates are extracted from filenames (YYYY-MM-DD-title.md) and stored in frontmatter as `date` field. Next.js should use this for sorting and display.

### 5. Related Posts

The `_data/related_posts.yml` file contains manual related post mappings. This should be used to implement "related posts" features in Next.js.

## Validation

All migrated content:

* ✅ Has valid YAML frontmatter
* ✅ Preserves original body content
* ✅ Maintains consistent structure
* ✅ Documents Jekyll-specific features with `_legacy_` prefix

## Next Steps for Next.js Implementation

1. Install Markdown processing libraries:
   ```bash
   npm install gray-matter remark remark-html js-yaml
   ```

2. Create content loader utilities:
   * `lib/posts.js` - Load and parse blog posts
   * `lib/pages.js` - Load and parse pages
   * `lib/data.js` - Load YAML data files

3. Create dynamic routes:
   * `app/[year]/[month]/[day]/[slug]/page.tsx` - Blog post route
   * `app/[slug]/page.tsx` - Page route

4. Implement React components:
   * Convert Liquid includes to React components
   * Create layout components
   * Add SEO components

5. Handle redirects:
   * Use Next.js `next.config.js` redirects or middleware
   * Map `_legacy_redirect_from` fields to redirect rules

6. Test thoroughly:
   * Verify all posts render correctly
   * Test URL routing matches Jekyll permalinks
   * Validate frontmatter parsing
   * Check data file loading

## Migration Scripts

The following scripts were used for migration:

* `/tmp/migrate-posts.rb` - Migrated blog posts
* `/tmp/migrate-pages.rb` - Migrated pages
* `/tmp/migrate-resume.rb` - Migrated resume positions

These scripts can be re-run if needed to update the migration.

## Rollback

Original Jekyll content remains in:

* `_posts/` - Original blog posts
* Root directory - Original pages
* `_data/` - Original data files
* `_resume_positions/` - Original resume positions

The migration is non-destructive - all original files are preserved.
