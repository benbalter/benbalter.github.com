---
applyTo: ["lib/**/*.rb", "script/**/*", "spec/**/*.rb", "Rakefile"]
---

# Ruby Code Instructions (LEGACY)

**NOTE: Ruby code is primarily for Jekyll maintenance (legacy) and build scripts. For new features, use TypeScript/JavaScript in the Next.js app.**

When working with Ruby code (Jekyll plugins, scripts, tests) for maintenance purposes, follow these guidelines:

## Code Style

* Follow Rubocop rules defined in `.rubocop.yml`
* Use frozen string literals: `# frozen_string_literal: true` at the top of files
* Use idiomatic Ruby patterns
* Keep methods focused and readable (single responsibility)
* Prefer `snake_case` for methods and variables
* Use descriptive names

## Jekyll Plugins (`lib/`) - LEGACY

**Only modify for maintenance, not for new features.**

* Place custom Jekyll plugins in `lib/`
* Plugins extend Jekyll's functionality (filters, tags, generators, etc.)
* Test plugins thoroughly as they affect the entire site build
* Document plugin usage in comments if not obvious

## Scripts (`script/`)

Scripts in this directory automate development tasks for both Jekyll (legacy) and Next.js:

* Follow the Scripts to Rule Them All pattern where applicable
* Make scripts idempotent (safe to run multiple times)
* Include error handling and clear output messages
* Document script usage with `--help` flags or comments
* Scripts may support both Jekyll and Next.js builds

## RSpec Tests (`spec/`) - LEGACY

**Only modify when maintaining Jekyll functionality.**

* Place test files in `spec/` directory
* Use descriptive test names with `context` and `it` blocks
* Test front matter requirements for pages and collections
* Verify Jekyll builds successfully
* Check HTML output when applicable

### Test Structure

```ruby
# frozen_string_literal: true

require 'spec_helper'

RSpec.describe 'Feature Name' do
  context 'when condition' do
    it 'does something expected' do
      expect(result).to eq(expected)
    end
  end
end
```

## Running Ruby Code

### Testing

```bash
bundle exec rspec              # Run all tests
bundle exec rspec spec/file.rb # Run specific test file
rake test                      # Run tests + HTML proofer
```

### Linting

```bash
rubocop                        # Check Ruby style
rubocop -a                     # Auto-fix issues
rubocop --only Style/FrozenStringLiteral # Check specific cop
```

### Building

```bash
rake build                     # Build Jekyll site
rake serve                     # Start development server
```

## Dependencies

* Add Ruby gems to `Gemfile`
* Run `bundle install` after adding dependencies
* Use conservative version constraints (`~>`)
* Keep dependencies up to date via Dependabot

## Security

* Never commit secrets or tokens
* Use environment variables for sensitive data (e.g., `JEKYLL_GITHUB_TOKEN`)
* Validate user input in plugins
* Avoid shell injection in scripts (use Ruby methods instead of backticks when possible)

## Best Practices

1. Write tests for new functionality
2. Run linters before committing
3. Keep changes minimal and focused
4. Follow existing code patterns
5. Document complex logic with comments
6. Test locally before pushing

Remember: This is a **production website**. Be conservative with changes to Ruby code that affects the build process.
