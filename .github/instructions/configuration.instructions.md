---
applyTo: ["**/*.{yml,yaml,json}", "!node_modules/**", "!vendor/**", "!package-lock.json"]
---

# Configuration Files Instructions

When working with YAML and JSON configuration files, follow these guidelines:

## YAML Files

### Front Matter (`_config.yml`, post headers)

- Use consistent indentation (2 spaces)
- Quote strings with special characters
- Use proper YAML types (strings, numbers, booleans, arrays, objects)
- Validate YAML syntax before committing

### Jekyll Configuration (`_config.yml`)

- Changes require Jekyll restart to take effect
- Test configuration changes locally first
- Document non-obvious settings with comments
- Use environment-specific configs when needed:
  - `_config.yml` - Production config
  - `_config_local.yml` - Local development overrides
  - `_config_test.yml` - Test environment

### Data Files (`_data/`)

- Place reusable data in `_data/` directory
- Access via `site.data.filename`
- Keep data files focused and organized
- Use meaningful file and key names

## JSON Files

### Package Configuration (`package.json`)

- Follow semver for version numbers
- Use `^` or `~` for dependency ranges appropriately
- Organize scripts logically
- Document non-obvious scripts with comments

### Tool Configuration

- ESLint: `.eslintrc.yml`
- Prettier: `frontmatter.json`
- Next.js: `next.config.mjs` (actually JavaScript)
- TypeScript: `tsconfig.json`

## Linting Configuration Files

```bash
npm run lint-yaml              # Lint YAML files
npm run lint-json              # Lint JSON files
```

## Common Patterns

### Jekyll `_config.yml`

```yaml
# Site settings
title: Site Title
description: Site description
url: https://example.com

# Build settings
markdown: kramdown
plugins:
  - jekyll-feed
  - jekyll-seo-tag

# Collections
collections:
  posts:
    output: true
    permalink: /:year/:month/:day/:title/
```

### Data Files `_data/navigation.yml`

```yaml
- name: Home
  url: /
- name: About
  url: /about/
- name: Blog
  url: /blog/
```

## Best Practices

1. **Validation**: Always validate syntax before committing
2. **Indentation**: Use consistent spacing (2 spaces for YAML)
3. **Comments**: Document complex or non-obvious configurations
4. **Security**: Never commit secrets in config files
5. **Environment Variables**: Use for sensitive data and environment-specific values
6. **Testing**: Test configuration changes locally before pushing

## Jekyll-Specific

### Collections Configuration

```yaml
collections:
  collection_name:
    output: true              # Generate pages for items
    permalink: /path/:name/   # URL structure
```

### Plugin Configuration

```yaml
plugins:
  - jekyll-plugin-name

# Plugin settings
plugin_name:
  setting: value
```

## Environment Variables

- Use `.env` for local development (don't commit!)
- Reference in Jekyll: `ENV['VARIABLE_NAME']`
- Document required environment variables in README
- Use `.env.example` as a template

## Testing Configuration Changes

```bash
rake build                     # Test Jekyll build
bundle exec jekyll doctor      # Check for issues
npm run lint-yaml              # Validate YAML syntax
npm run lint-json              # Validate JSON syntax
```

Remember: Configuration files affect the entire site. **Test thoroughly** before committing changes.
