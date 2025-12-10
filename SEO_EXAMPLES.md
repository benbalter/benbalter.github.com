# SEO Metadata Examples

This document shows real examples of the metadata generated for different page types on the website.

## Example 1: Static Page (About)

### URL

`https://ben.balter.com/about/`

### Generated HTML Meta Tags

```html
<!-- Basic Meta Tags -->
<meta charset="UTF-8">
<meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1">
<meta name="viewport" content="width=device-width, initial-scale=1.0, shrink-to-fit=no">
<meta name="generator" content="Astro v5.16.4">
<meta name="author" content="Ben Balter">
<meta name="keywords" content="Ben Balter, GitHub, open source, technology leadership, collaboration">
<meta name="description" content="Ben Balter is an attorney, an open source developer, and a Senior Technical Program Manager at GitHub, the world's largest software development network.">

<!-- Theme -->
<meta name="color-scheme" content="light dark">
<meta name="theme-color" content="#111111" media="(prefers-color-scheme: light)">
<meta name="theme-color" content="#eeeeee" media="(prefers-color-scheme: dark)">

<!-- Canonical URL -->
<link rel="canonical" href="https://ben.balter.com/about/">

<!-- Open Graph (Facebook, LinkedIn) -->
<meta property="og:type" content="website">
<meta property="og:url" content="https://ben.balter.com/about/">
<meta property="og:title" content="About | Ben Balter">
<meta property="og:description" content="Ben Balter is an attorney, an open source developer, and a Senior Technical Program Manager at GitHub, the world's largest software development network.">
<meta property="og:image" content="https://ben.balter.com/assets/img/headshot.jpg">
<meta property="og:site_name" content="Ben Balter">
<meta property="og:locale" content="en_US">
<meta property="article:author" content="Ben Balter">

<!-- Twitter Card -->
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:site" content="@benbalter">
<meta name="twitter:creator" content="@benbalter">
<meta name="twitter:url" content="https://ben.balter.com/about/">
<meta name="twitter:title" content="About | Ben Balter">
<meta name="twitter:description" content="Ben Balter is an attorney, an open source developer, and a Senior Technical Program Manager at GitHub, the world's largest software development network.">
<meta name="twitter:image" content="https://ben.balter.com/assets/img/headshot.jpg">

<!-- Title -->
<title>About | Ben Balter</title>
```

### Social Sharing Preview

**Facebook/LinkedIn:**

```
┌─────────────────────────────────────┐
│   [Image: Professional headshot]   │
│                                     │
│   About | Ben Balter               │
│   Ben Balter is an attorney, an     │
│   open source developer, and a      │
│   Senior Technical Program Manager  │
│   at GitHub...                      │
│                                     │
│   🔗 ben.balter.com                │
└─────────────────────────────────────┘
```

**Twitter:**

```
┌─────────────────────────────────────┐
│   [Large Image Card]               │
│   Professional headshot            │
│                                     │
│   @benbalter                        │
│   About | Ben Balter               │
│   Ben Balter is an attorney, an     │
│   open source developer...          │
└─────────────────────────────────────┘
```

---

## Example 2: Blog Post (Article)

### URL

`https://ben.balter.com/2011/08/31/enterprise-open-source-and-why-better-is-not-enough/`

### Generated HTML Meta Tags

```html
<!-- Basic Meta Tags -->
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0, shrink-to-fit=no">
<meta name="author" content="Ben Balter">
<meta name="description" content="Firms looking to seek a competitive advantage will begin to look past 'it has to be expensive and complicated' and start looking toward open-source software, not as a misfit alternative, but as a viable player in the software space, but before that can happen the open-source community must strive to be the serious competitor they wish to be treated as.">

<!-- Canonical URL -->
<link rel="canonical" href="https://ben.balter.com/2011/08/31/enterprise-open-source-and-why-better-is-not-enough/">

<!-- Open Graph (Note: type='article') -->
<meta property="og:type" content="article">
<meta property="og:url" content="https://ben.balter.com/2011/08/31/enterprise-open-source-and-why-better-is-not-enough/">
<meta property="og:title" content="Enterprise, Open Source, and Why Better is not Enough | Ben Balter">
<meta property="og:description" content="Firms looking to seek a competitive advantage will begin to look past 'it has to be expensive and complicated' and start looking toward open-source software, not as a misfit alternative, but as a viable player in the software space, but before that can happen the open-source community must strive to be the serious competitor they wish to be treated as.">
<meta property="og:image" content="https://ben.balter.com/assets/img/headshot.jpg">
<meta property="og:site_name" content="Ben Balter">
<meta property="og:locale" content="en_US">

<!-- Article-Specific Tags -->
<meta property="article:published_time" content="2011-08-31T00:00:00.000Z">
<meta property="article:author" content="Ben Balter">

<!-- Twitter Card -->
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:site" content="@benbalter">
<meta name="twitter:creator" content="@benbalter">
<meta name="twitter:url" content="https://ben.balter.com/2011/08/31/enterprise-open-source-and-why-better-is-not-enough/">
<meta name="twitter:title" content="Enterprise, Open Source, and Why Better is not Enough | Ben Balter">
<meta name="twitter:description" content="Firms looking to seek a competitive advantage will begin to look past 'it has to be expensive and complicated' and start looking toward open-source software...">
<meta name="twitter:image" content="https://ben.balter.com/assets/img/headshot.jpg">

<!-- Title -->
<title>Enterprise, Open Source, and Why Better is not Enough | Ben Balter</title>
```

### Key Differences from Static Pages

1. **Article Type**: `og:type="article"` instead of `og:type="website"`
2. **Publication Date**: `article:published_time` with ISO 8601 timestamp
3. **Automatic Date Extraction**: Date parsed from filename (YYYY-MM-DD-slug format)
4. **Semantic HTML**: Wrapped in `<article>` tag with proper structure
5. **Reading Time**: Automatically calculated and displayed

### Social Sharing Preview

**Facebook/LinkedIn:**

```
┌─────────────────────────────────────┐
│   [Image: Professional headshot]   │
│                                     │
│   Enterprise, Open Source, and      │
│   Why Better is not Enough          │
│   Firms looking to seek a           │
│   competitive advantage will begin  │
│   to look past...                   │
│                                     │
│   📅 August 31, 2011               │
│   ✍️ Ben Balter                    │
│   🔗 ben.balter.com                │
└─────────────────────────────────────┘
```

**Twitter:**

```
┌─────────────────────────────────────┐
│   [Large Image Card]               │
│   Professional headshot            │
│                                     │
│   @benbalter                        │
│   Enterprise, Open Source, and      │
│   Why Better is not Enough          │
│   Firms looking to seek a           │
│   competitive advantage...          │
│                                     │
│   📅 Aug 31, 2011                  │
└─────────────────────────────────────┘
```

---

## Example 3: Homepage (Posts List)

### URL

`https://ben.balter.com/`

### Generated HTML Meta Tags

```html
<!-- Basic Meta Tags -->
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0, shrink-to-fit=no">
<meta name="author" content="Ben Balter">
<meta name="keywords" content="Ben Balter, GitHub, open source, technology leadership, collaboration">
<meta name="description" content="Technology leadership, collaboration, and open source">

<!-- Canonical URL -->
<link rel="canonical" href="https://ben.balter.com/">

<!-- Open Graph -->
<meta property="og:type" content="website">
<meta property="og:url" content="https://ben.balter.com/">
<meta property="og:title" content="Posts | Ben Balter">
<meta property="og:description" content="Technology leadership, collaboration, and open source">
<meta property="og:image" content="https://ben.balter.com/assets/img/headshot.jpg">
<meta property="og:site_name" content="Ben Balter">

<!-- Twitter Card -->
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:site" content="@benbalter">
<meta name="twitter:creator" content="@benbalter">
<meta name="twitter:title" content="Posts | Ben Balter">
<meta name="twitter:description" content="Technology leadership, collaboration, and open source">
<meta name="twitter:image" content="https://ben.balter.com/assets/img/headshot.jpg">

<!-- Title -->
<title>Posts | Ben Balter</title>
```

---

## Testing Your Pages

### Facebook Sharing Debugger

```
URL: https://developers.facebook.com/tools/debug/
Input: https://ben.balter.com/about/

Results:
✅ og:title         - "About | Ben Balter"
✅ og:description   - "Ben Balter is an attorney..."
✅ og:image         - https://ben.balter.com/assets/img/headshot.jpg
✅ og:url           - https://ben.balter.com/about/
✅ og:type          - "website"
```

### Twitter Card Validator

```
URL: https://cards-dev.twitter.com/validator
Input: https://ben.balter.com/about/

Results:
✅ Card Type        - "summary_large_image"
✅ Title            - "About | Ben Balter"
✅ Description      - "Ben Balter is an attorney..."
✅ Image            - https://ben.balter.com/assets/img/headshot.jpg
✅ Preview          - Shows large image card
```

### LinkedIn Post Inspector

```
URL: https://www.linkedin.com/post-inspector/
Input: https://ben.balter.com/about/

Results:
✅ Title            - "About | Ben Balter"
✅ Description      - "Ben Balter is an attorney..."
✅ Image            - Professional headshot displayed
✅ Preview          - Rich media preview shown
```

---

## Common Patterns

### Pattern 1: Page with Custom Image

```astro
---
import PageLayout from '../layouts/PageLayout.astro';

const title = 'My Page';
const description = 'This is my page description';
const image = 'https://example.com/custom-image.jpg';
---

<PageLayout {title} {description} {image}>
  <h1>{title}</h1>
  <p>Content...</p>
</PageLayout>
```

**Result:**

- `og:image` and `twitter:image` will use custom image
- All other metadata generated automatically

### Pattern 2: Blog Post with Custom Image

```markdown
---
title: 'My Amazing Blog Post'
description: 'A detailed look at building amazing things'
image: 'https://cdn.example.com/blog-post-hero.jpg'
---

Blog post content here...
```

**Result:**

- `og:type="article"` automatically set
- `article:published_time` extracted from filename date
- Custom image used for social sharing
- Reading time calculated automatically

### Pattern 3: No Index Page

```astro
<BaseLayout 
  title="Internal Page" 
  description="Internal use only"
  noindex={true}
>
  <p>This page won't be indexed by search engines</p>
</BaseLayout>
```

**Result:**

- `<meta name="robots" content="noindex, nofollow">` added
- All other metadata still present for internal tools

---

## Summary

The website automatically generates comprehensive, standards-compliant metadata for:

✅ **Basic SEO**: title, description, keywords, canonical URLs  
✅ **Open Graph**: Facebook, LinkedIn rich previews  
✅ **Twitter Cards**: Large image cards with full metadata  
✅ **Article Support**: Publication dates, author attribution  
✅ **Theme Support**: Light/dark mode colors  
✅ **Accessibility**: Semantic HTML, proper structure  

All pages follow SEO best practices with **zero manual configuration required** beyond providing title, description, and optional image.
