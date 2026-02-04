# Contributing to Ben.Balter.com

Thank you for your interest in contributing to this project! This document provides guidelines and information for contributors.

## Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
- [Development Workflow](#development-workflow)
- [Coding Standards](#coding-standards)
- [Testing](#testing)
- [Submitting Changes](#submitting-changes)

## Code of Conduct

This project follows a code of conduct that all contributors are expected to adhere to. Please be respectful, inclusive, and constructive in all interactions.

## Getting Started

### Prerequisites

- **Node.js**: Version 20.x or later
- **npm**: Version 10.x or later (comes with Node.js)
- **Git**: For version control

### Setup

1. **Fork and clone the repository:**

   ```bash
   git clone https://github.com/YOUR_USERNAME/benbalter.github.com.git
   cd benbalter.github.com
   ```

2. **Install dependencies:**

   ```bash
   script/bootstrap
   ```

3. **Start development server:**

   ```bash
   npm run dev             # Start Astro server (http://localhost:4321)
   ```

## Development Workflow

### Project Structure

This project uses Astro as its static site generator:

- `src/content/posts/` - Blog posts (Markdown files)
- `src/layouts/` - Astro layout components
- `src/components/` - Reusable components
- `src/data/` - YAML data files
- `src/pages/` - Page components (become routes)
- `public/` - Static assets
- `script/` - Build and utility scripts

See [docs/ASTRO.md](docs/ASTRO.md) for Astro-specific documentation.

### Working with Content

#### Blog Posts

Blog posts are Markdown files in `src/content/posts/` with the format: `YYYY-MM-DD-title.md`

```markdown
---
title: "Your Post Title"
description: "Brief description for SEO"
---

Your content here...
```

## Coding Standards

### TypeScript (Astro)

- Use **strict TypeScript** (enabled in tsconfig.astro.json)
- Avoid `any` types - use proper types or `unknown`
- Handle null/undefined cases explicitly
- Document complex functions with JSDoc comments

### Code Style

- Run linters before committing:

  ```bash
  npm run lint
  ```

- Follow existing code patterns
- Write clear, descriptive variable names
- Keep functions focused and small

## Testing

### Running Tests

```bash
# All tests
npm test

# Linting
npm run lint

# TypeScript check
npm run check

# Unit tests
npm run test:vitest

# E2E tests
npm run test:e2e
```

### Writing Tests

- Add tests for new functionality
- Follow existing test patterns
- Test edge cases and error conditions
- Keep tests focused and readable

### E2E Tests

End-to-end tests use Playwright:

```bash
npm run test:e2e:ui      # Interactive UI mode
npm run test:e2e:headed  # Watch tests run in browser
```

## Submitting Changes

### Before Submitting

1. **Test your changes:**

   ```bash
   npm run build        # Verify Astro build
   npm test             # Run all tests
   ```

2. **Lint your code:**

   ```bash
   npm run lint
   ```

3. **Check TypeScript:**

   ```bash
   npm run check
   ```

### Creating a Pull Request

1. **Create a feature branch:**

   ```bash
   git checkout -b feature/your-feature-name
   ```

2. **Make your changes** and commit with descriptive messages:

   ```bash
   git add .
   git commit -m "Add feature: brief description"
   ```

3. **Push to your fork:**

   ```bash
   git push origin feature/your-feature-name
   ```

4. **Open a Pull Request** on GitHub with:
   - Clear title describing the change
   - Detailed description of what and why
   - Screenshots for UI changes
   - Reference any related issues

### Pull Request Guidelines

- **Keep PRs focused** - One feature or fix per PR
- **Write clear commit messages** - Explain what and why
- **Add tests** for new functionality
- **Update documentation** if needed
- **Respond to feedback** promptly and professionally

## GitHub Copilot Instructions

This repository includes comprehensive instructions for GitHub Copilot coding agents:

### General Instructions

- **`.github/copilot-instructions.md`** - Repository-wide context and guidelines

### Custom Agents

- **`.github/agents/code.md`** - Specialized agent for code changes (Ruby, JavaScript, HTML, CSS)
- **`.github/agents/writing.md`** - Specialized agent for blog posts and documentation

### Scoped Instructions

The `.github/instructions/` directory contains targeted instructions for specific areas:

- **`astro-components.instructions.md`** - Astro components and layouts
- **`styles.instructions.md`** - CSS and SCSS files
- **`configuration.instructions.md`** - YAML and JSON configuration
- **`testing.instructions.md`** - Test files and testing practices

These instructions help Copilot provide better suggestions and maintain code quality standards.

## Questions?

If you have questions or need help:

- Open an [issue](https://github.com/benbalter/benbalter.github.com/issues)
- Check existing [documentation](docs/)
- Review the [Astro documentation](https://docs.astro.build/)

## License

By contributing to this project, you agree that your contributions will be licensed under:

- **Content**: [Creative Commons BY 3.0](http://creativecommons.org/licenses/by/3.0/)
- **Code**: [MIT License](http://opensource.org/licenses/mit-license.php)

Thank you for contributing! 🎉
