---
applyTo: "_posts/**/*.md"
---

# Jekyll Blog Posts Instructions

When working with blog posts in `_posts/`, follow these guidelines:

## File Naming

* Blog post files MUST be named: `YYYY-MM-DD-title-with-hyphens.md`
* The date in the filename determines the post's publication date
* Use descriptive, URL-friendly titles in the filename

## Required Front Matter

Every blog post MUST include:

```yaml
---
title: Clear, descriptive title
description: Brief 1-2 sentence description for SEO (150-160 characters)
---
```

## Optional Front Matter

```yaml
comments: true              # Enable comments on the post
redirect_from: ["/old/"]   # For URL redirects from old paths
permalink: /custom-url/     # Custom URL (rarely needed)
```

## Content Guidelines

* Start headings at level 2 (`##`) - never use level 1 (`#`)
* Include blank lines around headings
* Use code fences with language identifiers: ```ruby,```javascript, etc.
* Break up long paragraphs for readability
* Use lists for scannable content
* Add internal links to related posts when relevant

## Writing Style

* Professional but approachable tone
* Clear, concise explanations
* Support claims with evidence or examples
* Make complex topics accessible
* Focus on actionable insights

## Linting

After editing Markdown:

1. Run `npm run lint-md` to check Markdown syntax
2. **ALWAYS** run `script/fix-lint` after markdown linting to remove excessive escaping

## Testing

Run `rake test` to validate:

* Front matter requirements
* HTML structure
* Link validity
* Overall build success
