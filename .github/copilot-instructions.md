# GitHub Copilot Instructions for benbalter.github.com

## Project Overview

This is the personal website of Ben Balter, built using Jekyll and hosted on GitHub Pages. The site serves as a personal blog, portfolio, and professional profile showcasing posts about technology leadership, collaboration, and open source.

**Key Features:**
- Jekyll-based static site with custom plugins
- Blog posts with related posts suggestions
- Resume and professional information
- GitHub integration for metadata
- RSS feeds and social media integration
- Optimized for performance and accessibility

## Tech Stack

### Core Technologies
- **Jekyll**: ~> 4.0 (static site generator)
- **Ruby**: 3.3.5 (see `.ruby-version` for exact version)
- **Node.js**: For JavaScript tooling and linting
- **GitHub Pages**: Hosting platform

### Key Dependencies

#### Ruby Gems (Jekyll Plugins)
- `jekyll-avatar`: GitHub avatar integration
- `jekyll-feed`: RSS feed generation
- `jekyll-github-metadata`: GitHub repository metadata
- `jekyll-mentions`: GitHub-style @mentions
- `jekyll-og-image`: Open Graph image generation
- `jekyll-redirect-from`: URL redirection support
- `jekyll-relative-links`: Relative link conversion
- `jekyll-seo-tag`: SEO metadata
- `jekyll-sitemap`: XML sitemap generation
- `jemoji`: GitHub emoji support
- `retlab`: Related posts generation

#### Development Tools
- **RSpec**: Ruby testing framework
- **Rubocop**: Ruby linter with performance and rspec extensions
- **html-proofer**: HTML validation and link checking
- **ESLint**: JavaScript and JSON linting
- **markdownlint**: Markdown linting
- **textlint**: Natural language linting
- **remark**: Markdown processing
- **Vale**: Prose linting
- **yamllint**: YAML file linting

## Development Commands

### Setup
```bash
bundle install          # Install Ruby dependencies
npm install            # Install Node.js dependencies
```

### Building
```bash
rake build             # Build the Jekyll site
script/build           # Alternative build command
```

### Testing
```bash
rake test              # Run all tests (RSpec + HTML Proofer)
script/cibuild         # CI build script
npm test               # Run linting (alias for npm run lint)
```

### Linting
```bash
npm run lint           # Run all linters (JS, JSON, Markdown)
npm run lint-js        # Lint JavaScript files
npm run lint-json      # Lint JSON files
npm run lint-md        # Lint Markdown files
npm run lint-text      # Lint text content
npm run lint-yaml      # Lint YAML files
rubocop                # Ruby linting
script/fix-lint        # Auto-fix linting issues
```

### Development Server
```bash
rake serve             # Start Jekyll development server with watch mode
script/server          # Alternative server command
```

## Project Structure

```
.
├── .github/           # GitHub configuration and workflows
├── _config.yml        # Main Jekyll configuration
├── _data/             # YAML data files
├── _includes/         # Reusable HTML/Liquid snippets
├── _layouts/          # Page templates
├── _posts/            # Blog posts (Markdown files with YYYY-MM-DD-title.md format)
├── _resume_positions/ # Resume position entries
├── assets/            # Static assets (CSS, JS, images)
├── script/            # Build and utility scripts
├── spec/              # RSpec tests
├── Gemfile            # Ruby dependencies
├── package.json       # Node.js dependencies
└── Rakefile           # Rake tasks
```

### Important Files
- `_config.yml`: Jekyll site configuration
- `llms.txt`: LLM/AI assistant context about the site
- `humans.txt`: Credits and site information
- `robots.txt`: Search engine crawler rules
- `sitemap_index.xml`: SEO sitemap

## Coding Standards and Best Practices

### Ruby
- Follow Rubocop rules defined in `.rubocop.yml`
- Use frozen string literals: `# frozen_string_literal: true`
- Write RSpec tests for new functionality in `spec/`
- Documentation comments are optional (disabled in Rubocop)
- Keep methods focused and readable

### JavaScript
- Follow ESLint rules in `.eslintrc.yml`
- Use ES module syntax (`type: "module"` in package.json)
- Use xo style guide settings (space indentation, esnext: false)
- Lint JSON files with ESLint

### Markdown and Content
- Follow markdownlint rules in `.markdown-lint.yml`
- Use remark for Markdown processing with consistent style
- Blog posts must have front matter with title and description
- Use proper YAML front matter format
- Include relevant metadata (date, tags, etc.)
- Write clear, grammatically correct prose

### Front Matter Requirements
Pages must include:
- `title`: Page title
- `description`: Brief description (for SEO)
- `permalink`: URL path (for pages)

Blog posts must include:
- `title`: Post title
- `description`: Post description
- Date in filename format: `YYYY-MM-DD-title.md`

### File Naming Conventions
- Blog posts: `_posts/YYYY-MM-DD-title-with-hyphens.md`
- Data files: `_data/filename.yml`
- Layouts: `_layouts/layout-name.html`
- Includes: `_includes/component-name.html`

## Testing Guidelines

### RSpec Tests
- Place test files in `spec/` directory
- Use descriptive test names with `context` and `it` blocks
- Test front matter requirements for pages and collections
- Verify Jekyll builds successfully
- Check HTML output with html-proofer

### HTML Validation
- All generated HTML must pass html-proofer checks
- Links must be valid (internal and external)
- Images must have alt text
- Proper HTML structure and accessibility

## Security and Privacy
- Never commit secrets or tokens to the repository
- Use environment variables for sensitive data (e.g., `JEKYLL_GITHUB_TOKEN`)
- Keep dependencies up to date via Dependabot
- Follow security best practices for Jekyll sites

## Content Guidelines
- Write in clear, professional tone
- Use inclusive language (checked via retext-equality)
- Maintain readability (checked via retext-readability)
- Check spelling and grammar (retext-spell, textlint)
- Use proper typographic conventions (em dashes, en dashes, etc.)

## Liquid Templates
- Use `{% include_cached %}` for frequently included partials
- Use descriptive variable names
- Follow Jekyll's Liquid best practices
- Leverage site variables from `_config.yml`
- Use filters appropriately (markdownify, strip_html, truncate, etc.)

## Git Workflow
- Work on feature branches
- Write descriptive commit messages
- Keep commits focused and atomic
- Test locally before committing
- CI/CD runs on all pushes (see `.github/workflows/`)

## Resources
- [Jekyll Documentation](https://jekyllrb.com/docs/)
- [GitHub Pages Documentation](https://docs.github.com/en/pages)
- [Liquid Template Language](https://shopify.github.io/liquid/)
- [Site Source Code](https://github.com/benbalter/benbalter.github.com)
- [Ben Balter's Blog](https://ben.balter.com)

## Notes for Copilot
- This is a **production website**—be conservative with changes
- Preserve existing functionality unless explicitly asked to modify
- Follow the established patterns in the codebase
- Test changes thoroughly with the existing test suite
- When adding new features, ensure they align with Jekyll best practices
- Maintain the site's clean, minimal aesthetic
- Prioritize performance and accessibility
