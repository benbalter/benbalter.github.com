---
applyTo: ["**/*.{yml,yaml,json}", "!node_modules/**", "!package-lock.json"]
---

# Configuration Files Instructions

When working with YAML and JSON configuration files, follow these guidelines:

## YAML Files

### Front Matter (post headers)

* Use consistent indentation (2 spaces)
* Quote strings with special characters
* Use proper YAML types (strings, numbers, booleans, arrays, objects)
* Validate YAML syntax before committing

### Astro Configuration (`astro.config.mjs`)

* Changes may require dev server restart
* Test configuration changes locally first
* Document non-obvious settings with comments

### Data Files (`src/data/`)

* Place reusable data in `src/data/` directory
* Keep data files focused and organized
* Use meaningful file and key names

## JSON Files

### Package Configuration (`package.json`)

* Follow semver for version numbers
* Use `^` or `~` for dependency ranges appropriately
* Organize scripts logically
* Document non-obvious scripts with comments

### Tool Configuration

* ESLint: `.eslintrc.yml`
* Prettier: `frontmatter.json`
* Astro: `astro.config.mjs`
* TypeScript: `tsconfig.astro.json`

## Linting Configuration Files

```bash
npm run lint-yaml              # Lint YAML files
npm run lint-json              # Lint JSON files
```

## Common Patterns

### Data Files `src/data/books.yml`

```yaml
Category Name:
  - title: Book Title
    asin: B00ABC123
    tldr: Brief description of the book
```

## Best Practices

1. **Validation**: Always validate syntax before committing
2. **Indentation**: Use consistent spacing (2 spaces for YAML)
3. **Comments**: Document complex or non-obvious configurations
4. **Security**: Never commit secrets in config files
5. **Environment Variables**: Use for sensitive data and environment-specific values
6. **Testing**: Test configuration changes locally before pushing

## Environment Variables

* Use `.env` for local development (don't commit!)
* Document required environment variables in README
* Use `.env.example` or `.env.astro.example` as a template

## Testing Configuration Changes

```bash
npm run build                  # Test Astro build
npm run check                  # Type-check TypeScript
npm run lint-yaml              # Validate YAML syntax
npm run lint-json              # Validate JSON syntax
```

Remember: Configuration files affect the entire site. **Test thoroughly** before committing changes.
