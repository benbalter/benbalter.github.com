# Prose Testing

This repository includes comprehensive prose testing to ensure content quality, consistency, and correctness.

## Overview

Prose tests check the quality of written content in markdown files, including:

- **Spelling and grammar** - via textlint, retext plugins, and Harper
- **Style consistency** - via Vale (optional) and remark
- **Structural quality** - via RSpec tests
- **Typographic corrections** - automatic fixes for quotes, dashes, etc.

## Running Prose Tests

### Quick Commands

```bash
# Run all prose tests (part of CI)
script/cibuild-content

# Run individual test suites
npm run lint-md          # Markdown linting + prose checking (remark)
npm run lint-text        # Text quality checking (textlint)
script/vale              # Style guide checking (if Vale is installed)
script/harper            # Grammar checking (if Harper is installed)
bundle exec rspec spec/prose_quality_spec.rb  # Structural tests
```

### Auto-fixing Issues

Many prose issues can be automatically fixed:

```bash
# Run markdown linting with auto-fix
# Run markdown linting with auto-fix
npm run lint-md

# Run textlint with auto-fix (use --fix flag, not --dry-run)
textlint *.md _posts/*.md _resume_positions/*.md --fix
```

**Note:** The `npm run lint-md` command now uses remark for linting only (without rewriting files) and markdownlint-cli2 for auto-fixing. This eliminates the need for `script/fix-lint` to clean up aggressive character escaping that remark previously added.

## Test Tools

### 1. Textlint

**Purpose:** Grammar, style, and common mistakes

**Configuration:** `.textlintrc`

**Key Rules:**

- `common-misspellings` - Catches typos
- `terminology` - Enforces consistent terminology (e.g., "GitHub" not "Github")
- `write-good` - Suggests improvements (warnings only to reduce noise)
- `stop-words` - Suggests alternatives for weak words (warnings only)
- `no-unmatched-pair` - Checks for balanced brackets/quotes
- `doubled-spaces` - Catches double spaces

**Customization:**

- Most rules set to "warning" severity to avoid blocking builds
- Technical terms (HTML, URL, VS Code, E2E) excluded from terminology checks
- Common abbreviations (e.g., etc., i.e.) allowed in stop-words

### 2. Remark + Retext

**Purpose:** Prose quality and natural language processing

**Configuration:** `.remarkrc.js`

**Active Prose Plugins:**

- `retext-equality` - Checks for insensitive language
- `retext-indefinite-article` - Validates a/an usage
- `retext-repeated-words` - Catches duplicated words
- `retext-spell` - Spell checking with custom dictionary
- `retext-profanities` - Flags profane language
- `retext-redundant-acronyms` - Catches "ATM machine" style errors
- `retext-sentence-spacing` - Ensures consistent spacing

**Disabled Plugins** (too noisy for technical writing):

- `retext-passive` - Passive voice detection
- `retext-readability` - Readability scoring
- `retext-simplify` - Word simplification suggestions
- `retext-intensify` - Hedge/weasel word detection

**Custom Dictionary:** `dictionary.txt` contains project-specific terms

**How Remark Works:**
Remark now runs in lint-only mode, checking for issues without rewriting files. This change eliminates the aggressive character escaping (e.g., `\[`, `\_`, `\(`) that previously required `script/fix-lint` to clean up.

Typographic corrections (smart quotes, em/en dashes, etc.) are applied by the textr plugin during linting but don't modify files. Use markdownlint-cli2 for actual file fixes.

### 3. Vale (Optional)

**Purpose:** Style guide enforcement

**Configuration:** `.vale.ini`

**Status:** Vale is not installed by default. If installed, it runs additional style checks using:

- Microsoft Writing Style Guide
- Alex (inclusive language)
- Proselint (writing advice)
- write-good
- Custom styles

**Installation:** See https://vale.sh/docs/vale-cli/installation/

**Usage:**

```bash
# Install Vale (macOS example)
brew install vale

# Run Vale
script/vale
```

### 4. Harper

**Purpose:** Offline, privacy-first grammar checking

**Status:** Harper is installed automatically in CI. For local use, install the `harper-cli` binary.

**Installation:** See https://github.com/Automattic/harper

**Usage:**

```bash
# Run Harper
script/harper
```

**Note:** `harper-cli` currently always exits with code 1 (even with no lints found), so the wrapper script uses `|| true` to prevent it from failing the build.

### 5. LanguageTool

**Purpose:** Grammar and style checking using LanguageTool

**Configuration:** Disabled rules are configured in `script/languagetool`

**Status:** In CI, LanguageTool runs as a Docker service container. Locally, it requires a running LanguageTool server (see [How to run LanguageTool on macOS](https://ben.balter.com/2025/01/30/how-to-run-language-tool-open-source-grammarly-alternative-on-macos/)).

**Disabled rules** (to avoid overlap with existing linters and Markdown false positives):

- `MORFOLOGIK_RULE_EN_US` – Spelling (handled by retext-spell)
- `EN_A_VS_AN` – a/an usage (handled by retext-indefinite-article)
- `ENGLISH_WORD_REPEAT_RULE` – Repeated words (handled by retext-repeated-words)
- `UPPERCASE_SENTENCE_START` – Code terms may start sentences
- `WHITESPACE_RULE` – Markdown formatting artifacts
- Various Markdown syntax false positives (brackets, punctuation, etc.)

**Usage:**

```bash
# Start LanguageTool locally (requires Docker)
docker run -d -p 8010:8010 erikvl87/languagetool

# Run LanguageTool checks
script/languagetool

# Or specify a custom server URL
LANGUAGETOOL_URL=http://localhost:8081 script/languagetool
```

### 6. RSpec Prose Quality Tests

**Purpose:** Structural and consistency checks

**File:** `spec/prose_quality_spec.rb`

**Tests:**

- No multiple consecutive blank lines
- No trailing whitespace
- No doubled spaces in prose
- Consistent heading capitalization (no periods at end)
- No broken internal links

**Running:**

```bash
bundle exec rspec spec/prose_quality_spec.rb
```

**Code Quality:**

The RSpec prose tests follow Ruby best practices and are checked with rubocop:

```bash
# Check code style
bundle exec rubocop spec/prose_quality_spec.rb

# Auto-correct style issues
bundle exec rubocop -a spec/prose_quality_spec.rb
```

Note: Some rubocop suggestions may be disabled in the code when they conflict with correct test implementation (e.g., `Style/HashEachMethods` is disabled for scan results that return arrays, not hashes).

## CI Integration

Prose tests run automatically in CI via the `content` job in `.github/workflows/ci.yml`:

```yaml
- name: script/cibuild-content
  run: script/cibuild-content
```

This runs:

1. `script/remark` - Markdown and prose linting
2. `script/lint-text` - Textlint grammar/style checking
3. `script/vale` - Vale style checking (if installed)
4. `script/harper` - Harper grammar checking
5. `script/languagetool` - LanguageTool grammar checking (if server available)

LanguageTool also runs as a separate CI job with a Docker service container for the LanguageTool server.

## Configuration Files

- `.textlintrc` - Textlint rules
- `.remarkrc.js` - Remark and retext configuration
- `.vale.ini` - Vale style guide configuration
- `dictionary.txt` - Custom dictionary for spell checking
- `.remarkignore` - Files to exclude from remark processing
- `.rubocop.yml` - Ruby code style rules for RSpec tests

## Troubleshooting

### Too Many Warnings

If prose tests generate too many warnings:

1. **Textlint:** Adjust severity levels in `.textlintrc` or disable specific rules
2. **Remark:** Comment out noisy retext plugins in `.remarkrc.js`
3. **Vale:** Adjust alert levels in `.vale.ini` or disable specific styles

### False Positives

To exclude specific terms or phrases:

1. **Spelling:** Add to `dictionary.txt`
2. **Terminology:** Add to `.textlintrc` under `terminology.exclude`
3. **Stop Words:** Add to `.textlintrc` under `stop-words.exclude`

### Build Breaking

If prose tests are breaking builds:

1. Most textlint rules are set to "warning" to avoid breaking builds
2. Vale only reports errors (`--minAlertLevel=error`)
3. RSpec tests are part of the code test suite, not content tests

## Best Practices

1. **Run tests locally** before committing to catch issues early
2. **Use auto-fix** when available (`npm run lint-md`, `--fix` for textlint)
3. **Add terms to dictionary** rather than ignoring spell check
4. **Balance strictness** - some rules are intentionally relaxed for readability

## Future Improvements

- Consider installing Vale in CI for consistent style checking
- Add more RSpec tests for prose structure
- Create pre-commit hooks for prose testing
- Add prose testing to the Astro content pipeline
