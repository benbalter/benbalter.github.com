# Open Graph Image Examples

This file contains example configurations for customizing OG images for different types of posts.

## Leadership Post with Red Accent

```yaml
---
title: "Leading Through Change"
description: "How to guide your team through organizational transitions"
og_image:
  border_bottom:
    width: 20
    fill:
      - "#DB4437"  # Google Red for leadership/important topics
---
```

## Technical Post with Green Accent

```yaml
---
title: "Building Scalable Systems"
description: "Architectural patterns for growth"
og_image:
  border_bottom:
    width: 20
    fill:
      - "#0F9D58"  # Google Green for technical/growth topics
---
```

## Creative/Innovation Post with Yellow Accent

```yaml
---
title: "Thinking Outside the Box"
description: "Fostering innovation in your organization"
og_image:
  border_bottom:
    width: 20
    fill:
      - "#F4B400"  # Google Yellow for creative topics
---
```

## Multi-Color Gradient

```yaml
---
title: "The Future of Work"
description: "Trends shaping remote collaboration"
og_image:
  border_bottom:
    width: 20
    fill:
      - "#4285F4"  # Blue
      - "#0F9D58"  # Green
      - "#F4B400"  # Yellow
      - "#DB4437"  # Red
---
```

## Custom Background Color

```yaml
---
title: "Dark Mode Design"
description: "Designing for accessibility and preference"
og_image:
  canvas:
    background_color: "#1a1a1a"
  header:
    color: "#FFFFFF"
  content:
    color: "#E0E0E0"
  border_bottom:
    width: 20
    fill:
      - "#4285F4"
---
```

## Minimal Style (No Border)

```yaml
---
title: "Simplicity in Design"
description: "Less is more in user experience"
og_image:
  border_bottom:
    width: 0
---
```

## Brand Event Style

```yaml
---
title: "GitHub Universe 2024"
description: "Key takeaways from this year's conference"
og_image:
  border_bottom:
    width: 30  # Thicker border for emphasis
    fill:
      - "#24292e"  # GitHub black
      - "#0366d6"  # GitHub blue
---
```

## Tips for Choosing Colors

1. **Consistency**: Use the same color scheme for related posts to create visual patterns
2. **Contrast**: Ensure text colors have sufficient contrast against backgrounds (aim for WCAG AA compliance: 4.5:1 ratio for normal text, 3:1 for large text)
3. **Brand alignment**: Consider using colors that match referenced brands or topics
4. **Emotional impact**: Colors convey emotion - choose intentionally
   - Blue: Trust, stability, professionalism
   - Red: Urgency, passion, importance
   - Green: Growth, success, nature
   - Yellow: Optimism, creativity, energy

## Testing Your Changes

To regenerate OG images for testing, the safest approach is to use force mode in `_config.yml`:

```yaml
og_image:
  force: true  # Regenerate all images
```

Then build the site:

```bash
bundle exec jekyll build
```

Remember to set `force: false` after testing to avoid unnecessary regeneration on every build.

Alternatively, you can manually delete specific images to regenerate them:

```bash
# Delete a specific image to regenerate it
rm assets/images/og/posts/[post-slug].png
bundle exec jekyll build
```
