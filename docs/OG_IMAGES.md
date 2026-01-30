# Open Graph Image Generation for Astro

This implementation provides automatic Open Graph (OG) image generation for blog posts using Satori and resvg-js, approximating the Jekyll `jekyll-og-image` plugin output.

## Overview

OG images are dynamically generated at build time for all blog posts. These images are used when posts are shared on social media platforms like Twitter, Facebook, LinkedIn, etc.

## Features

✨ **Brand Recognition**: Includes Ben's headshot/logo at top-right of each image (matching Jekyll's layout)
✨ **Professional Typography**: Uses Inter font with both regular (400) and bold (700) weights
✨ **Clean Design**: White background with title at top-left, description at bottom-left
✨ **Domain Attribution**: Shows ben.balter.com at bottom-right
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

3. **Configuration** (`src/lib/og-config.ts`):
   - Defines styling to approximate Jekyll's `jekyll-og-image` plugin output
   - Configures dimensions (1200x600), colors, fonts, and border
   - Matches the Google blue (#4285F4) accent border from `_config.yml`

4. **Post Pages** (`src/pages/[year]/[month]/[day]/[slug].astro`):
   - Automatically uses generated OG images
   - Falls back to custom images if specified in frontmatter
   - Inserts proper meta tags in HTML head

## Generated Image Format

- **Dimensions**: 1200 x 600 pixels (matching Jekyll)
- **Background**: White (#FFFFFF)
- **Logo**: Ben's headshot (150px) at top-right
- **Title**: 48px, bold (700), dark gray (#2f313d), line height 1.2
- **Description**: 28px, regular (400), medium gray (#535358), line height 1.4
- **Domain**: ben.balter.com at bottom-right
- **Border**: 20px Google blue (#4285F4) accent at bottom
- **Font**: Inter (loaded from fontsource.org)
- **Format**: PNG
- **Padding**: 80px

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
  backgroundColor: '#FFFFFF',
  title: {
    fontSize: 48,
    color: '#2f313d',
    lineHeight: 1.2,
    // ...
  },
  border: {
    height: 20,
    color: '#4285F4', // Google blue
  },
  logo: {
    path: './assets/img/headshot.jpg',
    size: 150,
  },
  domain: 'ben.balter.com',
  // ...
};
```

## Best Practices Implemented

1. **Brand Consistency**: Logo/headshot included on every OG image for immediate brand recognition
2. **Typography**: Inter font with proper weights (400 for body, 700 for title)
3. **Visual Hierarchy**: Clear distinction between title and description through size, weight, and color
4. **Proper Spacing**: 80px padding prevents text from feeling cramped
5. **Accessibility**: Good color contrast ratios for text readability
6. **Security**: Path validation prevents directory traversal attacks
7. **Performance**: Font and headshot caching across image generations

## Compatibility with Jekyll

This implementation approximates Jekyll's `jekyll-og-image` plugin:

- Similar visual layout (title top-left, logo top-right, description bottom-left, domain bottom-right)
- Same Google blue border accent from `_config.yml`
- Same logo/headshot from Jekyll config: `image: ./assets/img/headshot.jpg`
- Same domain display from Jekyll config: `domain: ben.balter.com`
- Same fallback to custom images when specified

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
