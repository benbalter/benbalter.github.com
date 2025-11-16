# Contributing to Ben.Balter.com

Thank you for your interest in contributing to this project! This document provides guidelines and information for contributors.

## Table of Contents

* [Code of Conduct](#code-of-conduct)
* [Getting Started](#getting-started)
* [Development Workflow](#development-workflow)
* [Coding Standards](#coding-standards)
* [Testing](#testing)
* [Submitting Changes](#submitting-changes)

## Code of Conduct

This project follows a code of conduct that all contributors are expected to adhere to. Please be respectful, inclusive, and constructive in all interactions.

## Getting Started

### Prerequisites

* **Node.js**: Version 20.x or later
* **npm**: Version 10.x or later (comes with Node.js)
* **Ruby**: Version 3.3.x (for Jekyll legacy features)
* **Git**: For version control

### Setup

1. **Fork and clone the repository:**

   ```bash
   git clone https://github.com/YOUR_USERNAME/benbalter.github.com.git
   cd benbalter.github.com
   ```

2. **Install dependencies:**

   ```bash
   npm install
   ```

3. **Start development server:**

   ```bash
   npm run dev
   ```

   Visit <http://localhost:3000> to see your changes.

## Development Workflow

### Project Structure

This project is transitioning from Jekyll to Next.js:

* `app/` - Next.js App Router pages and components
* `lib/` - Utility libraries and helpers
* `content/` - Markdown content (posts, pages, data)
* `public/` - Static assets
* `script/` - Build and utility scripts

See [docs/NEXTJS.md](docs/NEXTJS.md) for detailed architecture documentation.

### Working with Content

#### Blog Posts

Blog posts are Markdown files in `content/posts/` with the format: `YYYY-MM-DD-title.md`

```markdown
---
title: "Your Post Title"
description: "Brief description for SEO"
date: 2024-01-01
---

Your content here...
```

#### Creating New Components

When adding React components:

1. Place in `app/components/`
2. Use TypeScript with proper types
3. Prefer Server Components (default) over Client Components
4. Document props and usage

```typescript
interface MyComponentProps {
  title: string;
  description?: string;
}

export default function MyComponent({ title, description }: MyComponentProps) {
  return (
    <div>
      <h1>{title}</h1>
      {description && <p>{description}</p>}
    </div>
  );
}
```

## Coding Standards

### TypeScript

* Use **strict TypeScript** (enabled in tsconfig.json)
* Avoid `any` types - use proper types or `unknown`
* Handle null/undefined cases explicitly
* Document complex functions with JSDoc comments

```typescript
/**
 * Calculate reading time for content
 * @param content - The text content to analyze
 * @returns Reading time in minutes
 */
export function calculateReadingTime(content: string): number {
  const wordsPerMinute = 200;
  const words = content.trim().split(/\s+/).length;
  return Math.ceil(words / wordsPerMinute);
}
```

### React Best Practices

* **Server Components by default** - Only use Client Components when needed
* **Error boundaries** - Add error.tsx for route segments
* **Loading states** - Add loading.tsx for better UX
* **Metadata** - Use generateMetadata() for SEO

### Code Style

* Run linters before committing:

  ```bash
  npm run lint
  ```

* Follow existing code patterns
* Write clear, descriptive variable names
* Keep functions focused and small

## Testing

### Running Tests

```bash
# All tests
npm test

# Linting
npm run lint

# TypeScript check
npx tsc --noEmit

# E2E tests
npm run test:e2e
```

### Writing Tests

* Add tests for new functionality
* Follow existing test patterns
* Test edge cases and error conditions
* Keep tests focused and readable

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
   npm run next:build  # Verify production build
   npm test            # Run all tests
   ```

2. **Lint your code:**

   ```bash
   npm run lint
   ```

3. **Check TypeScript:**

   ```bash
   npx tsc --noEmit
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
   * Clear title describing the change
   * Detailed description of what and why
   * Screenshots for UI changes
   * Reference any related issues

### Pull Request Guidelines

* **Keep PRs focused** - One feature or fix per PR
* **Write clear commit messages** - Explain what and why
* **Add tests** for new functionality
* **Update documentation** if needed
* **Respond to feedback** promptly and professionally

## Questions?

If you have questions or need help:

* Open an [issue](https://github.com/benbalter/benbalter.github.com/issues)
* Check existing [documentation](docs/)
* Review the [Next.js documentation](https://nextjs.org/docs)

## License

By contributing to this project, you agree that your contributions will be licensed under:

* **Content**: [Creative Commons BY 3.0](http://creativecommons.org/licenses/by/3.0/)
* **Code**: [MIT License](http://opensource.org/licenses/mit-license.php)

Thank you for contributing! 🎉
