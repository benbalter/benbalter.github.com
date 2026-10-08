# Astro RSS Feed Implementation

## Overview

The site generates an RSS 2.0 feed at `/feed.xml`, the same URL the old Jekyll site used, so existing subscribers kept working through the migration.

## Feed URLs

1. **Main Blog Feed**: `/feed.xml`
   - Contains all published blog posts from `src/content/posts/`
   - Sorted by date (newest first)

## Feed Format

The feed is generated in **RSS 2.0 format** using the `@astrojs/rss` package.

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
- **Description**: Engineering leadership, open source, and showing your work
- **Link**: https://ben.balter.com/
- **Format**: RSS 2.0

## HTML Integration

Feed links are included in:

1. **HTML `<head>`**: `<link rel="alternate" type="application/rss+xml">`
2. **Footer**: RSS icon linking to `/feed.xml`

## Testing

To test the feed locally:

```bash
npm run build
# Feed generated at: dist-astro/feed.xml
```

To validate the feed:

```bash
python3 -c "import feedparser; print(feedparser.parse(open('dist-astro/feed.xml')).version)"
```
