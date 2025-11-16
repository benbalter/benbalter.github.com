# Legacy URL Redirects

This document describes how legacy URL redirects from Jekyll are implemented in the Next.js static site.

## Overview

Since the site is deployed as a static site (GitHub Pages) using Next.js with `output: 'export'`, server-side redirects are not available. Instead, we generate static HTML redirect pages that use meta refresh and JavaScript to redirect users to the correct pages.

## How It Works

### 1. Redirect Data in YAML Frontmatter

All redirect information remains in the YAML frontmatter of the original content files, just as it was in Jekyll:

```yaml
---
title: My Post
redirect_from:
  - /old/url/
  - /another/old/url/
---
```

Or for external redirects:

```yaml
---
title: My Post
redirect_to: https://example.com/new-location/
---
```

### 2. Redirect Generation Script

The `script/generate-redirects.mjs` script scans content directories and generates static HTML redirect pages.

### 3. Build Integration

The redirect generation is automatically integrated into the build process via `next:build` script.

## Adding New Redirects

To add a new redirect, add `redirect_from` or `redirect_to` to the YAML frontmatter of your content file.

## Testing

Run the Playwright tests: `npm run test:e2e -- e2e/redirects.spec.ts`
