# `Ben.Balter.com` <!-- markdownlint-disable-line MD002 -->

[![CI](https://github.com/benbalter/benbalter.github.com/actions/workflows/ci.yml/badge.svg)](https://github.com/benbalter/benbalter.github.com/actions/workflows/ci.yml)

The personal site of Ben Balter. Built using Next.js with static site generation. See [humans.txt](https://ben.balter.com/humans.txt) for more infos.

## Technology Stack

- **Next.js 16** - Modern React framework with App Router
- **TypeScript** - Type-safe development
- **Markdown** - Content authoring with gray-matter and remark
- **Static Site Generation** - Pre-rendered HTML for optimal performance

## Content Types

The site supports two content types:

1. **Posts** - Date-specific blog posts located in `_posts/` directory
   - Named format: `YYYY-MM-DD-slug.md`
   - Accessible at `/posts/[slug]`

2. **Pages** - Non-date specific content as markdown files in the root
   - Examples: `about.md`, `contact.md`, `talks.md`
   - Accessible at `/[slug]`

## Development

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Export static site
npm run export
```

The development server runs at `http://localhost:3000`.

## Deployment

The site is built as a static export to the `out/` directory and can be deployed to any static hosting service.

## License

* Content: [Creative Commons, BY](http://creativecommons.org/licenses/by/3.0/)
* Code: [MIT](http://opensource.org/licenses/mit-license.php)
