# `Ben.Balter.com` <!-- markdownlint-disable-line MD002 -->

[![CI](https://github.com/benbalter/benbalter.github.com/actions/workflows/ci.yml/badge.svg)](https://github.com/benbalter/benbalter.github.com/actions/workflows/ci.yml)

The personal site of Ben Balter. Built with Jekyll and Next.js, deployed to GitHub Pages.

## Architecture

This site uses a hybrid approach combining Jekyll and Next.js:

### Jekyll (Site Structure)

Jekyll handles the overall site structure, including:

* Homepage, about page, contact page, etc.
* Site layouts and templates
* Resume section
* Asset compilation (CSS, JS via webpack)
* RSS feeds and sitemaps

### Next.js (Blog Posts)

Next.js handles all blog posts dynamically:

* Posts are read from `_posts/*.md` files
* Dynamic routes at `/:year/:month/:day/:slug/`
* Blog index page at `/blog/`
* Markdown parsing with gray-matter and remark
* Static HTML export for GitHub Pages compatibility

## Building the Site

The site uses a combined build process that merges Jekyll and Next.js output:

```bash
npm run build       # Run combined Jekyll + Next.js build
```

This script:

1. Builds Jekyll to `_site/`
2. Builds Next.js posts to `.next-output/`
3. Merges Next.js posts into `_site/`

### Individual Builds

```bash
npm run build:jekyll    # Build only Jekyll site
npm run build:next      # Build only Next.js posts
npm run build:webpack   # Build only webpack assets
```

### Development

```bash
npm run dev             # Start Next.js development server (posts only)
bundle exec rake serve  # Start Jekyll development server (full site)
```

## Next.js Commands

```bash
npm run dev          # Start Next.js development server (http://localhost:3000)
npm run next:build   # Build Next.js for production (outputs to .next-output/)
npm run next:start   # Start Next.js production server
```

## Deployment

The site is deployed to GitHub Pages from the `_site/` directory, which contains the merged output of Jekyll and Next.js.

## License

* Content: [Creative Commons, BY](http://creativecommons.org/licenses/by/3.0/)
* Code: [MIT](http://opensource.org/licenses/mit-license.php)
