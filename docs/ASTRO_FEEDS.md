# Astro RSS Feed Implementation

## Overview

The Astro site now generates RSS feeds at the same URLs as the Jekyll site, ensuring compatibility with existing feed readers.

## Feed URLs

1. **Main Blog Feed**: `/feed.xml`
   - Contains all published blog posts from `src/content/posts/`
   - 186 posts as of implementation
   - Sorted by date (newest first)

2. **Press Feed**: `/press-feed.xml`
   - Contains press clips from `_data/clips.yml`
   - 60 clips as of implementation
   - Includes publication attribution via `dc:creator` element

## Feed Format

The feeds are generated in **RSS 2.0 format** using the `@astrojs/rss` package.

### Differences from Jekyll

- **Jekyll feeds**: Used Atom format via `jekyll-feed` plugin
- **Astro feeds**: Use RSS 2.0 format via `@astrojs/rss` package

Both formats are widely supported by feed readers, and RSS 2.0 is backward compatible with most Atom feed readers.

## Technical Implementation

### Dependencies

- `@astrojs/rss`: Official Astro RSS feed generator
- `@rollup/plugin-yaml`: For loading YAML data files
- `js-yaml`: YAML parser

### Feed Generation

Feeds are generated at build time as static XML files:

```typescript
// src/pages/feed.xml.ts - Main blog feed
// src/pages/press-feed.xml.ts - Press clips feed
```

### Configuration

The Astro config (`astro.config.mjs`) includes:
- YAML plugin for loading `_data/clips.yml`
- Site URL configuration for feed links

## Validation

Both feeds have been validated and parse without errors using:
- Python's `feedparser` library
- Manual XML structure validation
- RSS 2.0 schema compliance

## Feed Metadata

### Main Feed
- **Title**: Ben Balter
- **Description**: Technology leadership, collaboration, and open source
- **Link**: https://ben.balter.com/
- **Format**: RSS 2.0

### Press Feed
- **Title**: Ben Balter - Press
- **Description**: Press clips for Ben Balter
- **Link**: https://ben.balter.com/
- **Format**: RSS 2.0
- **Additional**: Includes `dc:creator` for publication attribution

## HTML Integration

Feed links are included in:
1. **HTML `<head>`**: `<link rel="alternate" type="application/rss+xml">`
2. **Footer**: RSS icon linking to `/feed.xml`

## Testing

To test feeds locally:
```bash
npm run astro:build
# Feeds generated at: dist-astro/feed.xml and dist-astro/press-feed.xml
```

To validate feeds:
```bash
python3 -c "import feedparser; print(feedparser.parse('dist-astro/feed.xml').version)"
```

## Migration Notes

When migrating from Jekyll to Astro:
- Feed URLs remain the same (`/feed.xml`, `/press-feed.xml`)
- Feed format changes from Atom to RSS 2.0 (transparent to most readers)
- All post metadata and links are preserved
- Press clips continue to load from `_data/clips.yml`
