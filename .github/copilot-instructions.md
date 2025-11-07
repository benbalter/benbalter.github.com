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

## Development Environment

### Development Container
This repository includes a devcontainer configuration (`.devcontainer/devcontainer.json`) for consistent development environments:
- Based on Ruby 3.3 with Node.js 20
- Automatically installs libvips-dev for image processing
- Runs `script/bootstrap` on container creation
- Forwards port 4000 for Jekyll server
- Pre-configured with VS Code extensions for Ruby, Markdown, and YAML

### Setup
```bash
script/bootstrap        # Recommended: runs all setup steps
# OR manually:
bundle install          # Install Ruby dependencies
npm install            # Install Node.js dependencies
```

**Note:** The `script/bootstrap` script also runs `script/branding` and is the preferred setup method.

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

## CI/CD Workflows

The repository uses GitHub Actions for continuous integration and deployment:

### CI Workflow (`.github/workflows/ci.yml`)
Runs on every push with three jobs:
1. **content**: Lints content files (Markdown, text) using Node.js tools
   - Runs: `script/cibuild-content`
2. **code**: Tests Ruby code and Jekyll build
   - Sets up Ruby with bundler caching
   - Installs libvips for image processing
   - Runs: `script/bootstrap` and `script/cibuild-code`
3. **lighthouse**: Performance and accessibility testing
   - Builds the site with Jekyll
   - Runs Lighthouse CI audits

### Other Workflows
- **lint.yml**: Runs linting checks
- **build-and-deploy.yml**: Builds and deploys to GitHub Pages
- **related-posts.yml**: Updates related posts using the retlab gem
- **codeql-analysis.yml**: Security vulnerability scanning
- **approve-and-merge-dependabot-prs.yml**: Automated Dependabot PR handling

### When Adding Dependencies
- Ruby gems: Add to `Gemfile` and run `bundle install`
- Node packages: Add to `package.json` and run `npm install`
- Always run tests after adding dependencies
- Dependabot automatically updates dependencies via PRs

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
│   ├── bootstrap          # Setup development environment
│   ├── build              # Build the Jekyll site
│   ├── server             # Start development server
│   ├── cibuild            # Main CI build script
│   ├── cibuild-code       # CI build for code checks
│   ├── cibuild-content    # CI build for content checks
│   ├── fix-lint           # Auto-fix linting issues
│   └── build-related-posts # Update related posts
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

### Test Workflow
1. **Before making changes**: Run `rake test` to verify existing tests pass
2. **During development**: Use `rake serve` to preview changes locally
3. **After code changes**: 
   - Run relevant linters: `npm run lint` or `rubocop`
   - Run `rake test` to verify all tests pass
4. **Before committing**: Run `script/fix-lint` to auto-fix linting issues

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

### Linting Best Practices
- Run `npm run lint` before committing content changes
- Run `rubocop` before committing Ruby code
- Use `script/fix-lint` to automatically fix most linting issues
- Check specific file types with targeted lint commands:
  - JavaScript: `npm run lint-js`
  - Markdown: `npm run lint-md`
  - Text content: `npm run lint-text`
  - YAML: `npm run lint-yaml`

## Security and Privacy

### Authentication and Tokens
- Never commit secrets or tokens to the repository
- Use environment variables for sensitive data:
  - `JEKYLL_GITHUB_TOKEN`: GitHub API token for accessing repository metadata
  - Optional: Store token in `~/.token` for local development (see `Rakefile`)
- The Rakefile automatically loads token from `~/.token` if it exists

### Security Best Practices
- Keep dependencies up to date via Dependabot
- CodeQL analysis runs automatically on all pushes
- Review Dependabot PRs promptly
- Follow Jekyll and GitHub Pages security best practices
- Use environment variables in CI/CD (GitHub Actions secrets)

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

### Branch Strategy
- Work on feature branches
- Write descriptive commit messages
- Keep commits focused and atomic
- Test locally before committing
- CI/CD runs on all pushes (see `.github/workflows/`)

### Build Artifacts and Ignored Files
The following are generated and should never be committed (already in `.gitignore`):
- `_site/`: Jekyll build output
- `node_modules/`: Node.js dependencies
- `.bundle/` and `vendor/bundle/`: Ruby gem cache
- `assets/css/style.css`: Compiled CSS (built from Sass)
- `assets/js/bundle.js`: Compiled JavaScript (built with webpack)
- `.sass-cache/`: Sass compilation cache
- `.jekyll-cache/` and `.jekyll-metadata`: Jekyll build cache
- `Gemfile.lock`: Locked in production but not committed

### Development Workflow
1. Create a feature branch: `git checkout -b feature-name`
2. Make changes following the coding standards
3. Run `script/fix-lint` to fix linting issues
4. Run `rake test` to verify all tests pass
5. Commit changes with descriptive messages
6. Push and create a pull request
7. CI will run all checks automatically

## Resources
- [Jekyll Documentation](https://jekyllrb.com/docs/)
- [GitHub Pages Documentation](https://docs.github.com/en/pages)
- [Liquid Template Language](https://shopify.github.io/liquid/)
- [Site Source Code](https://github.com/benbalter/benbalter.github.com)
- [Ben Balter's Blog](https://ben.balter.com)

## Troubleshooting

### Common Issues

**Jekyll build fails with "command not found: bundle"**
- Solution: Run `gem install bundler` or use the devcontainer

**Missing libvips library error**
- Solution: Install libvips: `sudo apt-get install libvips-dev`
- Already installed in devcontainer and CI

**Port 4000 already in use**
- Solution: Kill existing Jekyll server or use a different port
- Check for running processes: `lsof -i :4000`

**Asset compilation errors**
- Solution: Run `npm run webpack` to rebuild JavaScript/CSS bundles
- Ensure all npm dependencies are installed: `npm install`

**Test failures after changes**
- Check if changes broke front matter requirements
- Verify all links are valid
- Ensure images have alt text
- Run `script/fix-lint` to fix common issues

**GitHub API rate limiting**
- Solution: Set `JEKYLL_GITHUB_TOKEN` environment variable
- For local development, save token in `~/.token`

## Notes for Copilot
- This is a **production website**—be conservative with changes
- Preserve existing functionality unless explicitly asked to modify
- Follow the established patterns in the codebase
- Test changes thoroughly with the existing test suite
- When adding new features, ensure they align with Jekyll best practices
- Maintain the site's clean, minimal aesthetic
- Prioritize performance and accessibility
