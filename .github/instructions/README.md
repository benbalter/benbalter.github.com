# Scoped Agent Instructions

This directory contains scoped instruction files for GitHub Copilot and Claude Code. These instructions provide context-specific guidance when working with different parts of the codebase.

## How It Works

Each `.instructions.md` file uses YAML frontmatter to scope when it applies:

```yaml
---
applyTo: "path/pattern/**/*.ext"   # Copilot
excludeAgent: "code-review"         # Optional, Copilot only: exclude specific agents
paths:                              # Claude Code (same globs, no ! negations)
  - "path/pattern/**/*.ext"
---

# Instructions content here
```

Claude Code loads them through the symlinks in [`.claude/rules/`](../../.claude/rules/). When you add a file here, add its `paths:` and a matching symlink there.

## Instruction Files

### Code

* **`astro-components.instructions.md`**
  * Applies to: `src/**/*.astro`, `src/**/*.ts` (excluding tests)
  * Astro component structure and best practices
  * TypeScript utilities and testing
  * Content collections usage
  * Performance and accessibility guidelines

* **`styles.instructions.md`**
  * Applies to: `src/styles/**/*.css`, `src/**/*.astro`
  * Tailwind CSS v4 utilities and `@layer components`
  * Responsive design patterns

### Configuration and Testing

* **`configuration.instructions.md`**
  * Applies to: `**/*.{yml,yaml,json}`
  * Astro configuration
  * Data files
  * Tool configuration

* **`testing.instructions.md`**
  * Applies to: Test files and Playwright configs
  * Excludes: `code-review` agent
  * E2E testing with Playwright
  * Vitest unit testing
  * Test best practices

## Related Files

* **[`AGENTS.md`](../../AGENTS.md)** - General repository instructions
* **[`../agents/code.md`](../agents/code.md)** - Custom code agent
* **[`../agents/writing.md`](../agents/writing.md)** - Custom writing agent
* **[`../agents/seo.md`](../agents/seo.md)** - Custom SEO agent

## Learn More

* [GitHub Copilot Documentation](https://docs.github.com/en/copilot)
* [Best Practices for Copilot Coding Agent](https://docs.github.com/en/copilot/tutorials/coding-agent/get-the-best-results)
* [Custom Instructions Documentation](https://github.blog/changelog/2025-07-23-github-copilot-coding-agent-now-supports-instructions-md-custom-instructions/)
