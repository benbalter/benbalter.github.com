# Liquid Template Syntax Support

This document describes the Liquid template syntax support added to the Next.js markdown processing pipeline.

## Overview

The site now supports Jekyll-style Liquid template syntax in markdown files, enabling:

- Custom tags like `{% github_edit_link %}`
- Variable interpolation (`{{ site.title }}`, `{{ page.title }}`)
- Raw content blocks (`{% raw %}...{% endraw %}`)

## Implementation

### Components

1. **`lib/liquid.ts`** - Core Liquid processing engine
   - Custom tag registration (e.g., `{% github_edit_link %}`)
   - Context preparation with site config and page data
   - Error handling with graceful fallback

2. **`lib/markdown.ts`** - Updated markdown pipeline
   - Processes Liquid syntax BEFORE emoji and markdown conversion
   - Accepts optional context parameter for variable interpolation

3. **Component Chain** - Updated to pass context
   - `MarkdownContent.tsx` - Accepts optional context parameter
   - `PostContent.tsx` - Passes context to MarkdownContent
   - Post page - Provides page metadata (path, title, date, slug)

### Processing Order

```
Markdown Input
    ↓
1. Liquid Processing (variables, tags, raw blocks)
    ↓
2. Emoji Processing (:emoji: syntax)
    ↓
3. Markdown to HTML (remark/rehype)
    ↓
HTML Output
```

## Supported Tags

### `{% github_edit_link %}`

Generates a link to edit the current page on GitHub.

**Syntax:**

```liquid
{% github_edit_link %}
{% github_edit_link "custom text" %}
```

**Example:**

```markdown
Please {% github_edit_link "help improve this article" %}.
```

**Output:**

```html
Please <a href="https://github.com/benbalter/benbalter.github.com/edit/main/_posts/2023-01-13-great-extended-leave-documents.md">help improve this article</a>.
```

### `{% raw %}...{% endraw %}`

Preserves Liquid syntax without processing (useful for code examples).

**Example:**

```markdown
To use variables, write:
```liquid
{% raw %}{{ site.title }}{% endraw %}
```

```

## Variable Interpolation

### Site Variables

Access site configuration from `_config.yml`:

```liquid
{{ site.title }}        → "Ben Balter"
{{ site.url }}          → "https://ben.balter.com"
{{ site.repository }}   → "benbalter/benbalter.github.com"
{{ site.branch }}       → "main"
```

### Page Variables

Access current page metadata:

```liquid
{{ page.title }}  → Post title
{{ page.date }}   → Post date
{{ page.slug }}   → Post slug
{{ page.path }}   → File path
```

## Error Handling

If Liquid parsing fails (e.g., malformed syntax):

1. Warning is logged to console
2. Original content is returned unchanged
3. Page continues to render

This prevents broken posts from breaking the entire build.

## Testing

Comprehensive test coverage in `lib/liquid.test.ts`:

- `{% raw %}` tag preservation
- `{% github_edit_link %}` with default and custom text
- Variable interpolation (site and page)
- Error handling for malformed syntax

## Performance

- **Build Time**: Liquid processing happens once at build time (SSG)
- **Client Bundle**: No additional JavaScript sent to client
- **Server Components**: All processing in server components

## Migration from Jekyll

Posts with existing Liquid syntax work without modification:

- `{% raw %}` blocks preserved for code examples
- `{% github_edit_link %}` processed correctly
- Variable references work with site config

## Examples in Production

### Post with `{% github_edit_link %}`

- `content/posts/2023-01-13-great-extended-leave-documents.md`
- Uses: `{% github_edit_link "pull requests are always welcome" %}`

### Post with `{% raw %}` blocks

- `content/posts/2015-09-13-github-pages-edit-button.md`
- Uses: `{% raw %}{{ site.title }}{% endraw %}` in code examples

## Future Enhancements

Potential additions:

- More Jekyll tags (e.g., `{% include %}`, `{% for %}`)
- Custom filters
- Conditional logic support
- Additional site/page variables
