# `Ben.Balter.com` <!-- markdownlint-disable-line MD002 -->

[![CI](https://github.com/benbalter/benbalter.github.com/actions/workflows/ci.yml/badge.svg)](https://github.com/benbalter/benbalter.github.com/actions/workflows/ci.yml)

The personal site of Ben Balter. Built using Next.js and deployed to GitHub Pages as a static site.

## Tech Stack

- **Next.js 16** - React framework with static site generation (SSG)
- **TypeScript** - Type safety and better developer experience
- **Markdown** - Content stored in markdown files with frontmatter
- **GitHub Pages** - Hosting and deployment

## Content Types

This site has two main content types:

- **Posts** (`content/posts/`) - Date-specific blog posts with filenames like `YYYY-MM-DD-slug.md`
- **Pages** (`content/pages/`) - Non-date specific pages like About, Contact, etc.

## Development

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Preview production build
npm start
```

The dev server will be available at `http://localhost:3000`.

## Project Structure

```
.
├── app/                    # Next.js app directory
│   ├── layout.tsx         # Root layout
│   ├── page.tsx           # Home page (lists all posts)
│   ├── [page]/            # Dynamic route for pages
│   └── posts/[slug]/      # Dynamic route for posts
├── content/
│   ├── posts/             # Blog posts markdown files
│   └── pages/             # Pages markdown files
├── lib/
│   ├── content.ts         # Content parsing utilities
│   └── utils.ts           # Helper functions
└── next.config.mjs        # Next.js configuration
```

## Deployment

The site is automatically built and deployed to GitHub Pages via GitHub Actions when changes are pushed to the `main` branch. The workflow:

1. Installs dependencies
2. Builds the Next.js site with `npm run build`
3. Exports static HTML to the `out` directory
4. Deploys to GitHub Pages

## License

* Content: [Creative Commons, BY](http://creativecommons.org/licenses/by/3.0/)
* Code: [MIT](http://opensource.org/licenses/mit-license.php)
