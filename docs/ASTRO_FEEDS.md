# Astro RSS Feed Implementation

## Overview

The Astro site now generates an RSS feed at the same URL as the Jekyll site, ensuring compatibility with existing feed readers.

## Feed URLs

1. **Main Blog Feed**: `/feed.xml`
   - Contains all published blog posts from `src/content/posts/`
   - 186 posts as of implementation
   - Sorted by date (newest first)

## Feed Format

The feed is generated in **RSS 2.0 format** using the `@astrojs/rss` package.

### Differences from Jekyll

- **Jekyll feeds**: Used Atom format via `jekyll-feed` plugin
- **Astro feeds**: Use RSS 2.0 format via `@astrojs/rss` package

Both formats are widely supported by feed readers, and RSS 2.0 is backward compatible with most Atom feed readers.

## Technical Implementation

### Dependencies

- `@astrojs/rss`: Official Astro RSS feed generator

### Feed Generation

Feeds are generated at build time as static XML files:

```typescript
// src/pages/feed.xml.ts - Main blog feed
```

### Configuration

The Astro config (`astro.config.mjs`) includes:
- Site URL configuration for feed links

## Validation

The feed has been validated and parses without errors using:
- Python's `feedparser` library
- Manual XML structure validation
- RSS 2.0 schema compliance

## Feed Metadata

### Main Feed
- **Title**: Ben Balter
- **Description**: Technology leadership, collaboration, and open source
- **Link**: https://ben.balter.com/
- **Format**: RSS 2.0

## HTML Integration

Feed links are included in:
1. **HTML `<head>`**: `<link rel="alternate" type="application/rss+xml">`
2. **Footer**: RSS icon linking to `/feed.xml`

## Testing

To test the feed locally:
```bash
npm run astro:build
# Feed generated at: dist-astro/feed.xml
```

To validate the feed:
```bash
python3 -c "import feedparser; print(feedparser.parse(open('dist-astro/feed.xml')).version)"
```

## Migration Notes

When migrating from Jekyll to Astro:
- Feed URL remains the same (`/feed.xml`)
- Feed format changes from Atom to RSS 2.0 (transparent to most readers)
- All post metadata and links are preserved
