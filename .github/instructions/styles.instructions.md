---
applyTo: ["sass/**/*.scss", "assets/**/*.css", "app/**/*.css"]
---

# Styles Instructions

When working with CSS and SCSS files, follow these guidelines:

## SCSS Structure

* SCSS files are in `sass/` directory
* Use SCSS syntax (variables, nesting, mixins)
* Compile to CSS for production
* Follow existing file organization

## Bootstrap Usage

* Site uses Bootstrap for base styles and components
* Use Bootstrap utility classes where appropriate
* Override Bootstrap variables in SCSS when needed
* Don't fight Bootstrap - work with its patterns

## Responsive Design

* Use mobile-first approach
* Test styles at multiple breakpoints
* Use Bootstrap's responsive utilities
* Ensure touch-friendly interactions on mobile

## CSS Best Practices

### Naming Conventions

* Use kebab-case for class names: `.my-component`
* Follow BEM-like patterns for complex components
* Keep class names descriptive and semantic
* Avoid overly specific selectors

### Selectors

* Keep specificity low
* Avoid deeply nested selectors (max 3 levels)
* Use classes over IDs for styling
* Avoid `!important` unless absolutely necessary

### Performance

* Minimize CSS bundle size
* Avoid unused styles
* Use CSS containment when appropriate
* Optimize for rendering performance

## Common Patterns

```scss
// Use variables
$primary-color: #0366d6;
$spacing-unit: 1rem;

// Mobile-first responsive
.component {
  padding: $spacing-unit;
  
  @media (min-width: 768px) {
    padding: $spacing-unit * 2;
  }
}

// Use nesting wisely (not too deep)
.card {
  border: 1px solid #ddd;
  
  &__title {
    font-weight: bold;
  }
  
  &__body {
    padding: 1rem;
  }
}
```

## Accessibility

* Ensure sufficient color contrast (WCAG AA minimum)
* Don't rely solely on color to convey information
* Respect user preferences (prefers-reduced-motion, etc.)
* Make focus states visible and clear

## Testing Styles

```bash
npm run build:css              # Compile SCSS to CSS
npm run webpack                # Build all assets
rake serve                     # Preview in development
```

## Browser Support

* Support modern browsers (last 2 versions)
* Use autoprefixer for vendor prefixes
* Test critical pages in multiple browsers
* Graceful degradation for older browsers

## Dark Mode (if applicable)

* Use CSS custom properties for colors
* Respect `prefers-color-scheme` media query
* Test both light and dark modes
* Ensure readability in both modes

Remember: Keep styles **maintainable, performant, and accessible**. Follow existing patterns and conventions.
