---
title: "Example Blog Post in Markdown"
description: "This is an example blog post demonstrating Markdown support in Astro with Jekyll-compatible frontmatter."
published: true
comments: false
tags:
  - astro
  - markdown
  - example
---

This is an example blog post written in **Markdown** format. It demonstrates how Astro handles Markdown content with Jekyll-compatible frontmatter.

## Markdown Features

Astro supports all standard Markdown features:

### Text Formatting

* **Bold text** and *italic text*
* ~~Strikethrough text~~
* `Inline code`

### Lists

1. Ordered list item 1
2. Ordered list item 2
3. Ordered list item 3

### Links and Images

Check out [Ben Balter's blog](https://ben.balter.com) for more content.

### Code Blocks

```javascript
// JavaScript code with syntax highlighting
function greet(name) {
  console.log(`Hello, ${name}!`);
}

greet('Astro');
```

```python
# Python code example
def calculate_sum(a, b):
    return a + b

result = calculate_sum(10, 20)
print(f"Sum: {result}")
```

### Blockquotes

> This is a blockquote. It can be used to highlight important information or quotes from other sources.
>
> — Ben Balter

## GitHub Flavored Markdown

Astro also supports GitHub Flavored Markdown features:

### Tables

| Feature | Jekyll | Next.js | Astro |
|---------|--------|---------|-------|
| Build Speed | Slow | Fast | Very Fast |
| JavaScript | Minimal | React | Zero by default |
| DX | Good | Excellent | Excellent |

### Task Lists

- [x] Configure Astro
- [x] Add MDX integration
- [x] Create example content
- [ ] Migrate all blog posts
- [ ] Deploy to production

### Autolinks

URLs are automatically converted to links: https://astro.build

## Conclusion

This example demonstrates how Markdown content works in Astro with proper frontmatter validation and Jekyll compatibility. The content is type-safe thanks to Zod schema validation.
