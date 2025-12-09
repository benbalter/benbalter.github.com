# Open Graph Image Generation for Astro

This implementation provides automatic Open Graph (OG) image generation for blog posts using the `astro-og-canvas` library, with best practices enhancements.

## Overview

OG images are dynamically generated at build time for all blog posts. These images are used when posts are shared on social media platforms like Twitter, Facebook, LinkedIn, etc.

## Features

✨ **Brand Recognition**: Includes Ben's headshot/logo at the top of each image (matching Jekyll's og_image config)
✨ **Professional Typography**: Uses Inter font with optimized line heights for readability
✨ **Visual Depth**: Subtle gradient background (white to light gray) for visual interest
✨ **High Quality**: PNG format at 95% quality for crisp rendering on all platforms
✨ **Smart Fallback**: Custom images from frontmatter take precedence over generated images

## How It Works

1. **OG Image Endpoint** (`src/pages/og/[...route].ts`):
   - Generates PNG images for all published blog posts
   - Uses the post's title and description
   - Creates images at build time as static assets
   - Images are served at `/og/{year}/{month}/{day}/{slug}.png`

2. **Configuration** (`src/lib/og-config.ts`):
   - Defines styling to match Jekyll's `jekyll-og-image` plugin
   - Configures dimensions (1200x630), colors, fonts, and border
   - Matches the Google blue (#4285F4) accent border from `_config.yml`

3. **Post Pages** (`src/pages/[year]/[month]/[day]/[slug].astro`):
   - Automatically uses generated OG images
   - Falls back to custom images if specified in frontmatter
   - Inserts proper meta tags in HTML head

## Generated Image Format

- **Dimensions**: 1200 x 630 pixels (standard OG image size)
- **Background**: Subtle gradient (white #FFFFFF to light gray #F8F9FA)
- **Logo**: Ben's headshot (100px width, proportional height) at top left
- **Title**: 64px, bold, dark gray (#2f313d), line height 1.1
- **Description**: 32px, medium gray (#535358), line height 1.4
- **Border**: 20px Google blue (#4285F4) accent at bottom
- **Font**: Inter (loaded from fontsource.org)
- **Format**: PNG at 95% quality (~90KB per image)
- **Padding**: 80px for better spacing

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
  height: 630,
  backgroundColor: '#FFFFFF',
  title: {
    fontSize: 64,
    color: '#2f313d',
    lineHeight: 1.1,
    // ...
  },
  border: {
    height: 20,
    colors: ['#4285F4'], // Google blue
  },
  logo: {
    path: './assets/img/headshot.jpg',
    size: 100,
  },
  // ...
};
```

## Best Practices Implemented

1. **Brand Consistency**: Logo/headshot included on every OG image for immediate brand recognition
2. **Typography**: Inter font for modern, clean appearance with optimized line heights
3. **Visual Hierarchy**: Clear distinction between title and description through size and color
4. **Gradient Background**: Subtle gradient adds depth without overwhelming content
5. **High Quality Output**: PNG format at 95% quality ensures crisp rendering
6. **Proper Spacing**: Increased padding (80px) prevents text from feeling cramped
7. **Accessibility**: Good color contrast ratios for text readability

## Compatibility with Jekyll

This implementation maintains compatibility with Jekyll's `jekyll-og-image` plugin:

- Same visual style (colors, fonts, layout)
- Same Google blue border accent
- Same logo/headshot placement (from Jekyll config: `image: ./assets/img/headshot.jpg`)
- Same domain display
- Same fallback to custom images when specified

## Dependencies

- **astro-og-canvas**: OG image generation library for Astro
- **satori**: SVG/PNG rendering engine (dependency of astro-og-canvas)
- **canvaskit-wasm**: WebAssembly-based canvas rendering (dependency of astro-og-canvas)

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
- Each image is ~90KB in size (includes logo/headshot)
- Total size for 184 images: ~16.5MB
