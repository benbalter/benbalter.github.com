# Astro Redirect Implementation

This document describes how the `redirect_from` and `redirect_to` functionality has been replicated in Astro to match Jekyll's behavior.

## Overview

The redirect functionality allows posts and pages to:
1. **redirect_from**: Redirect old URLs to the current post/page URL
2. **redirect_to**: Redirect the post/page to an external URL

This matches the behavior of the Jekyll [`jekyll-redirect-from`](https://github.com/jekyll/jekyll-redirect-from) plugin.

## Implementation

### Components

1. **`src/scripts/generate-redirects.ts`**: Script that reads frontmatter from posts and pages, then generates HTML redirect pages
2. **`src/lib/redirect-integration.ts`**: Astro integration that hooks into the build process to run the redirect generation script
3. **`astro.config.mjs`**: Updated to include the redirect integration

### How It Works

1. During Astro build (`npm run astro:build`), the redirect integration runs after the static site is generated
2. The script reads all markdown files in `src/content/posts/` and `src/content/pages/`
3. For each file with `redirect_from` or `redirect_to` in frontmatter, it generates redirect HTML pages
4. Redirect pages are created in the `dist-astro/` directory

### Redirect HTML Structure

Each redirect page includes (matching Jekyll's format):

```html
<!DOCTYPE html>
<html lang="en-US">
<head>
  <meta charset="utf-8">
  <title>Redirecting&hellip;</title>
  <link rel="canonical" href="[target-url]">
  <script>location="[target-url]"</script>
  <meta http-equiv="refresh" content="0; url=[target-url]">
  <meta name="robots" content="noindex">
</head>
<body>
  <h1>Redirecting&hellip;</h1>
  <a href="[target-url]">Click here if you are not redirected.</a>
</body>
</html>
```

This provides multiple redirect mechanisms:
- **JavaScript redirect**: Instant redirect for modern browsers
- **Meta refresh**: Fallback for browsers without JavaScript
- **Canonical link**: SEO signal to search engines
- **Robots noindex**: Prevents indexing of redirect pages
- **Fallback link**: Manual link for edge cases

## Usage

### In Post/Page Frontmatter

#### Single Redirect From

```yaml
---
title: My Post
description: A great post
redirect_from: /old/url/to/post/
---
```

#### Multiple Redirects From

```yaml
---
title: My Post
description: A great post
redirect_from:
  - /old/url/1/
  - /old/url/2/
  - /old/url/3/
---
```

#### Redirect To External URL

```yaml
---
title: My Post
description: This post moved to another site
redirect_to: https://example.com/new-location/
---
```

## Examples

### Page Redirects

**Resume page** (`src/content/pages/resume.md`):
```yaml
---
title: Resume
permalink: /resume/
redirect_from:
  - /cv/
---
```

**Result**: `/cv/` redirects to `/resume/`

### Post Redirects

**Types of Pull Requests** (`src/content/posts/2015-12-08-types-of-pull-requests.mdx`):
```yaml
---
title: The six types of pull requests you see on GitHub
redirect_from: "/2014/12/08/types-of-pull-requests/"
---
```

**Result**: `/2014/12/08/types-of-pull-requests/` (old date) redirects to `/2015/12/08/types-of-pull-requests/` (correct date)

### External Redirects

**Communicate Like a GitHub Engineer** (`src/content/posts/2023-10-04-how-to-communicate-like-a-github-engineer.md`):
```yaml
---
title: How to communicate like a GitHub engineer
redirect_to: https://github.blog/engineering/engineering-principles/how-to-communicate-like-a-github-engineer-our-principles-practices-and-tools/
---
```

**Result**: `/2023/10/04/how-to-communicate-like-a-github-engineer/` redirects to the GitHub Blog post

## Build Statistics

From the latest build:
- **Total pages generated**: 190
- **Redirect pages generated**: 27
  - 4 page redirects (cv, books, books-for-geeks, recommended-reading)
  - 23 post redirects (typos, wrong dates, special characters, external URLs)

## Testing

### Manual Testing

After building, check that redirect HTML files exist:

```bash
# Build the site
npm run astro:build

# Check a redirect page
cat dist-astro/cv/index.html

# List all redirect pages
find dist-astro -name "index.html" -type f | grep -E "(cv|books|2014/12/08)" | head -10
```

### E2E Testing

The E2E test suite in `e2e/redirects.spec.ts` validates:
- Page redirects work correctly
- Post redirects handle typos, wrong dates, and special characters
- External redirects display correct HTML
- Redirect HTML structure matches Jekyll format

Run tests with:
```bash
npm run test:e2e:astro -- e2e/redirects.spec.ts
```

## Comparison with Jekyll

| Feature | Jekyll | Astro | Match |
|---------|--------|-------|-------|
| `redirect_from` (single string) | ✅ | ✅ | ✅ |
| `redirect_from` (array) | ✅ | ✅ | ✅ |
| `redirect_to` (external URL) | ✅ | ✅ | ✅ |
| HTML structure | ✅ | ✅ | ✅ |
| Meta refresh | ✅ | ✅ | ✅ |
| JavaScript redirect | ✅ | ✅ | ✅ |
| Canonical link | ✅ | ✅ | ✅ |
| Robots noindex | ✅ | ✅ | ✅ |
| Fallback link | ✅ | ✅ | ✅ |

**Result**: 100% feature parity with Jekyll's `jekyll-redirect-from` plugin

## Maintenance

### Adding New Redirects

1. Add `redirect_from` or `redirect_to` to post/page frontmatter
2. Run `npm run astro:build`
3. Redirect pages are automatically generated

### Debugging

If redirects aren't working:

1. **Check frontmatter syntax**: Ensure YAML is valid
2. **Check build output**: Look for redirect generation messages
3. **Check dist-astro directory**: Verify HTML files were created
4. **Check redirect HTML**: Ensure target URL is correct

### Removing Redirects

1. Remove `redirect_from` or `redirect_to` from frontmatter
2. Rebuild the site
3. Old redirect pages won't be regenerated

## Performance

- **Build time impact**: Minimal (< 1 second for 27 redirects)
- **File size**: Each redirect page is ~400-500 bytes
- **Total size**: 27 redirects = ~12 KB total
- **Client-side impact**: JavaScript redirect is instant
- **SEO impact**: Canonical links and noindex prevent duplicate content issues

## Future Enhancements

Possible improvements:
1. **Server-side redirects**: Generate `_redirects` file for Netlify/Vercel
2. **Redirect validation**: Check for broken redirect chains or circular redirects
3. **Redirect analytics**: Track which redirects are being used
4. **Wildcard redirects**: Support pattern-based redirects

## Related Documentation

- [`src/content/config.ts`](../src/content/config.ts): Content schema with redirect fields
- [ASTRO_URL_STRUCTURE.md](./ASTRO_URL_STRUCTURE.md): URL structure and compatibility
- [ASTRO_MIGRATION_SUMMARY.md](./ASTRO_MIGRATION_SUMMARY.md): Overall migration summary
