# Open Graph Image Configuration

This site uses a custom fork of [jekyll-og-image](https://github.com/benbalter/jekyll-og-image) to automatically generate social media preview images for blog posts.

## Features

- **Automatic generation**: OG images are automatically created during site build
- **Description support**: Images include post descriptions for better context
- **Brand consistency**: Uses site colors and headshot for consistent branding
- **Optimized sizing**: 1200×600px images optimized for social media platforms

## Configuration

The OG image settings are defined in `_config.yml` under the `og_image` key:

```yaml
og_image:
  output_dir: assets/images/og          # Where generated images are saved
  domain: ben.balter.com                # Domain name displayed on images
  image: ./assets/img/headshot.jpg      # Logo/headshot image
  verbose: false                         # Enable verbose logging
  force: false                           # Force regeneration of existing images
  skip_drafts: true                      # Skip draft posts
  margin_bottom: 100                     # Bottom margin for text elements
  canvas:
    width: 1200                          # Canvas width in pixels
    height: 600                          # Canvas height in pixels
    background_color: "#FFFFFF"          # Background color
  header:
    font_family: "Helvetica, Bold"       # Title font
    color: "#2f313d"                     # Title color
  content:
    font_family: "Helvetica, Regular"    # Description font
    color: "#535358"                     # Description color
  border_bottom:
    width: 20                            # Bottom border width
    fill:
      - "#4285F4"                        # Bottom border color (Google Blue)
```

## Per-Post Override

Individual posts can override the global configuration by adding an `og_image` section to their front matter.

For detailed examples, see [OG Image Examples](og-image-examples.md).

### Basic Example

```yaml
---
title: My Post Title
description: A great post description
og_image:
  canvas:
    background_color: "#F0F0F0"
  header:
    color: "#000000"
  border_bottom:
    fill:
      - "#DB4437"  # Use red instead of blue
---
```

### Color Palette Suggestions

For topic-specific visual branding, consider these Google color combinations:

- **Default (Blue)**: `#4285F4` - General content
- **Red**: `#DB4437` - Important announcements or leadership topics
- **Yellow**: `#F4B400` - Creative or innovation topics
- **Green**: `#0F9D58` - Success stories or growth topics

You can also use gradient fills with multiple colors:

```yaml
border_bottom:
  fill:
    - "#4285F4"
    - "#DB4437"
    - "#F4B400"
    - "#0F9D58"
```

## Image Output

Generated images are saved to `assets/images/og/posts/[post-slug].png` and are automatically referenced in the page metadata via jekyll-seo-tag.

## Custom Fork Details

This site uses a fork of jekyll-og-image with the following enhancements:

- **Description rendering**: Post descriptions are rendered on the OG image below the title
- **Customized layout**: Optimized text positioning and sizing for readability
- **Domain placement**: Domain name is positioned in the bottom-right corner

## Social Media Specifications

The generated 1200×600px images meet the specifications for:

- **Twitter/X**: Recommended size for Summary Card with Large Image
- **Facebook**: Optimal dimensions for link sharing
- **LinkedIn**: Recommended image size for link previews
- **Open Graph**: Standard OG image dimensions

## Regenerating Images

To regenerate all images (force rebuild):

```bash
# Edit _config.yml and set:
og_image:
  force: true

# Build the site
bundle exec jekyll build

# Remember to set force back to false afterward
```

## Troubleshooting

If images aren't generating:

1. Check that `libvips` is installed (required by the plugin)
2. Verify the headshot image exists at `assets/img/headshot.jpg`
3. Enable verbose logging: `og_image: { verbose: true }`
4. Check build output for error messages

## Future Improvements

Potential enhancements to consider:

- [ ] Merge upstream changes to support pages and collections (not just posts)
- [ ] Add support for custom fonts
- [ ] Support for multiple color schemes
- [ ] Option to disable description text
- [ ] Background image support
