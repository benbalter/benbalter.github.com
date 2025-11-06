# `Ben.Balter.com` <!-- markdownlint-disable-line MD002 -->

[![CI](https://github.com/benbalter/benbalter.github.com/actions/workflows/ci.yml/badge.svg)](https://github.com/benbalter/benbalter.github.com/actions/workflows/ci.yml)

The personal site of Ben Balter. Built using Next.js with Static Site Generation (SSG), deployed via GitHub Pages. See [humans.txt](https://ben.balter.com/humans.txt) for more infos.

## Development

This site uses Next.js 16 with the App Router and is statically exported for GitHub Pages deployment.

### Local Development

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Preview production build locally
npx serve -s out
```

### Project Structure

- `app/` - Next.js app router pages and routes
- `_posts/` - Blog posts in Markdown format (YYYY-MM-DD-title.md)
- `_data/` - YAML data files
- `lib/` - Utility functions for reading markdown and data files
- `public/` - Static assets copied to the output
- `out/` - Generated static site (after build)

### Content

Blog posts are written in Markdown with frontmatter and stored in the `_posts/` directory. The file naming convention is `YYYY-MM-DD-title.md`, which determines the URL structure: `/YYYY/MM/DD/title/`.

Static pages are implemented as Next.js pages in the `app/` directory and may reference Markdown files in the root directory.

## License

* Content: [Creative Commons, BY](http://creativecommons.org/licenses/by/3.0/)
* Code: [MIT](http://opensource.org/licenses/mit-license.php)
