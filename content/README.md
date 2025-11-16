# Content Directory

This directory contains all website content migrated from Jekyll to Next.js-compatible Markdown format.

## Structure

```
content/
├── posts/                  # Blog posts (184 files)
├── pages/                  # Site pages (9 files)
├── data/                   # Data files (3 files)
├── resume/                 # Resume positions (10 files)
├── MIGRATION.md            # Detailed migration documentation
├── EDGE-CASES.md           # Edge cases and special considerations
├── NEXTJS-INTEGRATION.md   # Next.js integration guide (if exists)
├── validate-migration.sh   # Validation script
└── README.md               # This file
```

## Validation

To validate the migration, run the validation script:

```bash
bash content/validate-migration.sh
```

This script checks:

* All files are present and organized correctly
* All required frontmatter fields are present
* All Jekyll-specific fields are properly prefixed with `_legacy_`

## Usage in Next.js

### Reading Blog Posts

```javascript
import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

export function getAllPosts() {
  const postsDirectory = path.join(process.cwd(), 'content/posts');
  const filenames = fs.readdirSync(postsDirectory);
  
  const posts = filenames.map((filename) => {
    const filePath = path.join(postsDirectory, filename);
    const fileContents = fs.readFileSync(filePath, 'utf8');
    const { data, content } = matter(fileContents);
    
    return {
      slug: filename.replace(/\.md$/, ''),
      frontmatter: data,
      content: content,
    };
  });
  
  // Sort by date
  return posts.sort((a, b) => {
    return new Date(b.frontmatter.date) - new Date(a.frontmatter.date);
  });
}
```

### Reading Pages

```javascript
export function getPage(slug) {
  const pagesDirectory = path.join(process.cwd(), 'content/pages');
  const filePath = path.join(pagesDirectory, `${slug}.md`);
  const fileContents = fs.readFileSync(filePath, 'utf8');
  const { data, content } = matter(fileContents);
  
  return {
    frontmatter: data,
    content: content,
  };
}
```

### Loading Data Files

```javascript
import yaml from 'js-yaml';

export function loadData(filename) {
  const dataDirectory = path.join(process.cwd(), 'content/data');
  const filePath = path.join(dataDirectory, filename);
  const fileContents = fs.readFileSync(filePath, 'utf8');
  return yaml.load(fileContents);
}

// Example usage
const books = loadData('books.yml');
const clips = loadData('clips.yml');
```

## Frontmatter Reference

### Blog Posts

```yaml
---
title: Post Title
description: Post description for SEO and social sharing
image: https://example.com/image.jpg
date: '2024-01-08'
comments: true
published: true
_legacy_redirect_from:
  - /old-url/
_legacy_layout: post
---
```

### Pages

```yaml
---
title: Page Title
description: Page description
_legacy_layout: page
_legacy_permalink: /about/
published: true
---
```

### Resume Positions

```yaml
---
employer: Company Name
title: Job Title
start_date: '2023-01-01'
end_date: '2024-01-01'
---
```

## Content Format

All content files use standard Markdown with YAML frontmatter:

* **Frontmatter**: Delimited by `---` at the start of the file
* **Body**: Standard Markdown after the frontmatter

## Notes

* Original Jekyll content is preserved in the repository root
* See `MIGRATION.md` for detailed migration documentation
* Fields prefixed with `_legacy_` are Jekyll-specific and may need Next.js alternatives
* Date format is YYYY-MM-DD
* Blog post filenames follow the pattern: `YYYY-MM-DD-title.md`

## Dependencies

Recommended npm packages for Next.js:

```bash
npm install gray-matter      # Parse frontmatter
npm install remark          # Markdown processing
npm install remark-html     # Convert Markdown to HTML
npm install js-yaml         # Parse YAML data files
```
