# Open Graph Image Generation for Astro

This implementation provides automatic Open Graph (OG) image generation for blog posts using Satori and resvg-js with a modern, Tailwind-inspired design.

## Overview

OG images are dynamically generated at build time for all blog posts. These images are used when posts are shared on social media platforms like Twitter, Facebook, LinkedIn, etc.

## Features

✨ **Modern Design**: Subtle gradient background with left accent bar for visual interest
✨ **Brand Recognition**: Circular avatar with border at top-right
✨ **Professional Typography**: Uses Inter font with bold titles and clean descriptions
✨ **Smart Description Handling**: Automatically strips markdown formatting and truncates long descriptions
✨ **Domain Attribution**: Shows ben.balter.com in primary brand color
✨ **High Quality**: PNG format for crisp rendering on all platforms
✨ **Smart Fallback**: Custom images from frontmatter take precedence over generated images

## How It Works

1. **OG Image Endpoint** (`src/pages/og/[...route].ts`):
   - Generates PNG images for all published blog posts
   - Uses the post's title and description
   - Creates images at build time as static assets
   - Images are served at `/og/{year}/{month}/{day}/{slug}.png`

2. **OG Image Generator** (`src/lib/og-image-generator.ts`):
   - Uses Satori to render SVG from JSX-like virtual DOM
   - Converts SVG to PNG using resvg-js
   - Caches fonts and headshot image for performance
   - Includes path validation to prevent directory traversal
   - Strips markdown formatting from descriptions

3. **Configuration** (`src/lib/og-config.ts`):
   - Defines styling using Tailwind-inspired color values
   - Configures dimensions (1200x600), colors, fonts, and accent bar
   - Uses site's primary brand color (#337ab7) for accent elements

4. **Post Pages** (`src/pages/[year]/[month]/[day]/[slug].astro`):
   - Automatically uses generated OG images
   - Falls back to custom images if specified in frontmatter
   - Inserts proper meta tags in HTML head

## Generated Image Format

- **Dimensions**: 1200 x 600 pixels (standard OG size)
- **Background**: Subtle gradient from gray-50 (#f8f9fa) to white
- **Accent Bar**: 8px primary blue (#337ab7) on left side
- **Logo**: Circular (140px) with white border and shadow, at top-right
- **Title**: 52px, bold (700), dark gray (#212529), line height 1.2
- **Description**: 24px, regular (400), gray (#6c757d), max 150 chars with ellipsis
- **Domain**: 20px, semibold, primary blue (#337ab7)
- **Font**: Inter (loaded from fontsource.org)
- **Format**: PNG
- **Padding**: 60px

## Usage

### Automatic Generation

All blog posts automatically get OG images generated at build time:

```bash
npm run astro:build
```

Generated images are placed in `dist-astro/og/{year}/{month}/{day}/{slug}.png`.

### Custom Images

To use a custom OG image for a specific post, add the `image` field to the post's frontmatter:

```yaml
---
title: My Post Title
description: Post description
image: https://example.com/custom-image.jpg
---
```

When a custom image is specified, the auto-generated image is skipped for that post.

## Configuration

To customize the OG image styling, edit `src/lib/og-config.ts`:

```typescript
export const defaultOGConfig: OGImageConfig = {
  width: 1200,
  height: 600,
  background: {
    color: '#FFFFFF',
    gradientFrom: '#f8f9fa',  // Tailwind gray-50
    gradientTo: '#FFFFFF',
  },
  title: {
    fontSize: 52,
    color: '#212529',  // Tailwind gray-900
    // ...
  },
  accent: {
    width: 8,
    color: '#337ab7',  // Primary blue
    gradientFrom: '#337ab7',
    gradientTo: '#2a6493',
  },
  logo: {
    path: './assets/img/headshot.jpg',
    size: 140,
    borderRadius: 70,  // Full circle
    borderWidth: 4,
    borderColor: '#FFFFFF',
  },
  domain: {
    text: 'ben.balter.com',
    fontSize: 20,
    color: '#337ab7',
  },
  // ...
};
```

## Best Practices Implemented

1. **Brand Consistency**: Logo/headshot and primary color accent on every OG image
2. **Typography**: Inter font with proper weights (400 for body, 700 for title)
3. **Visual Hierarchy**: Clear distinction between title and description through size, weight, and color
4. **Modern Design**: Subtle gradient background and accent bar using Tailwind-inspired colors
5. **Proper Spacing**: 60px padding prevents text from feeling cramped
6. **Accessibility**: Good color contrast ratios for text readability
7. **Security**: Path validation prevents directory traversal attacks
8. **Performance**: Font and headshot caching across image generations
9. **Smart Text Handling**: Markdown is stripped from descriptions, long text is truncated

## Dependencies

- **satori**: SVG rendering from JSX-like virtual DOM
- **@resvg/resvg-js**: SVG to PNG conversion

## Testing

To preview generated OG images:

1. Build the site: `npm run astro:build`
2. Start preview server: `npm run astro:preview`
3. Navigate to a post's OG image: `http://localhost:4321/og/{year}/{month}/{day}/{slug}.png`

Or use a simple HTTP server:

```bash
python3 -m http.server 8000 --directory dist-astro
```

Then visit: `http://localhost:8000/og/{year}/{month}/{day}/{slug}.png`

## Performance

- Images are generated at build time, not at request time
- No runtime overhead
- Static PNG files are served directly by CDN
- Fonts and headshot are cached across image generations
