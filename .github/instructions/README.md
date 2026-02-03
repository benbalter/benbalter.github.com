# GitHub Copilot Instructions

This directory contains scoped instruction files for GitHub Copilot coding agents. These instructions provide context-specific guidance when working with different parts of the codebase.

## How It Works

Each `.instructions.md` file uses YAML frontmatter to scope when it applies:

```yaml
---
applyTo: "path/pattern/**/*.ext"
excludeAgent: "code-review"  # Optional: exclude specific agents
---

# Instructions content here
```

## Instruction Files

### Code

* **`astro-components.instructions.md`**
  * Applies to: `src/**/*.astro`, `src/**/*.ts` (excluding tests)
  * Astro component structure and best practices
  * TypeScript utilities and testing
  * Content collections usage
  * Performance and accessibility guidelines

* **`styles.instructions.md`**
  * Applies to: `sass/**/*.scss`, `assets/**/*.css`, `app/**/*.css`
  * CSS and SCSS best practices
  * Bootstrap usage
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

* **`../.github/copilot-instructions.md`** - General repository instructions
* **`../.github/agents/code.md`** - Custom code agent
* **`../.github/agents/writing.md`** - Custom writing agent

## Learn More

* [GitHub Copilot Documentation](https://docs.github.com/en/copilot)
* [Best Practices for Copilot Coding Agent](https://docs.github.com/en/copilot/tutorials/coding-agent/get-the-best-results)
* [Custom Instructions Documentation](https://github.blog/changelog/2025-07-23-github-copilot-coding-agent-now-supports-instructions-md-custom-instructions/)
