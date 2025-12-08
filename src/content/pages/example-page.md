---
title: "Example Page in Markdown"
description: "An example page demonstrating Markdown content for static pages in Astro."
permalink: /example-page/
published: true
---

This is an example static page written in Markdown. Pages are different from blog posts - they're typically used for about pages, contact pages, or other standalone content.

## Page Structure

Static pages in Astro use the same content collection system as blog posts, but with a slightly different schema. Pages typically include:

* A title and description for SEO
* A permalink for the URL
* The main content in Markdown

## Jekyll Compatibility

This frontmatter structure is compatible with Jekyll, making migration easier:

* `title`: Page title
* `description`: SEO description
* `permalink`: Custom URL path
* `published`: Control visibility
* `layout`: Optional layout specification

## Content Organization

In Astro, pages are stored in `src/content/pages/` while blog posts go in `src/content/posts/`. This separation keeps your content organized and makes it easy to apply different layouts and styling.

### Benefits of Content Collections

Astro's content collections provide:

1. **Type Safety**: Frontmatter is validated against a Zod schema
2. **Better DX**: TypeScript autocompletion for frontmatter fields
3. **Compile-time Validation**: Catch errors before deployment
4. **Unified API**: Consistent way to query all content

## Markdown Support

All standard Markdown features work in pages:

### Links

Check out the [blog posts](/posts/) or return to the [home page](/).

### Lists

* Simple unordered lists
* Work as expected
* In page content

### Code Examples

```bash
# Build the Astro site
npm run astro:build

# Start development server
npm run astro:dev
```

### Blockquotes

> Pages provide a way to create standalone content that isn't part of the blog chronology.

## Next Steps

After creating your page content:

1. Add it to the navigation menu in `BaseLayout.astro`
2. Create a route in `src/pages/` to render it
3. Build and test the site

---

*This is an example page. Replace this content with your actual page content.*
