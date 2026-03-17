---
on:
  schedule: monthly
  skip-if-match: 'is:issue is:open in:title "[seo-audit]"'
permissions:
  contents: read
safe-outputs:
  create-issue:
    title-prefix: "[seo-audit] "
    labels: [seo, content]
    close-older-issues: true
    expires: 30d
---

## Monthly SEO Health Check

Audit the site's content and metadata for SEO improvements. The site is an Astro static site hosted on GitHub Pages at ben.balter.com.

## What to analyze

### Meta tags and structured data
- Check pages in `src/pages/` for proper `<title>` and `<meta name="description">` tags
- Verify JSON-LD structured data is present and valid in layouts (`src/layouts/`)
- Check Open Graph (`og:title`, `og:description`, `og:image`) and Twitter card meta tags
- Look for duplicate or missing meta descriptions across pages

### Blog post SEO (src/content/posts/)
- Identify the 20 most recent posts and assess SEO strength:
  - Title length (ideal: 50-60 characters)
  - Description length (ideal: 150-160 characters)
  - Heading structure (proper h2/h3 hierarchy, descriptive headings)
  - Keyword presence in title, description, and first paragraph
- Find posts with missing, weak, or duplicate descriptions

### Internal linking analysis
- Identify "orphan" posts that have few or no internal links pointing to them from other posts
- Find clusters of topically related posts that should cross-link but don't
- Key topic clusters to check: open source, remote work, government technology, technology leadership, collaboration, "showing your work"

### Technical SEO
- Verify sitemap configuration in `astro.config.mjs`
- Check `robots.txt` for correctness
- Verify canonical URL handling in layouts
- Check that the RSS feed is properly configured and discoverable

## Prioritization

Focus on **quick wins** — changes that are easy to implement but have meaningful SEO impact:
1. Missing or weak meta descriptions (high impact, easy fix)
2. Internal linking gaps between related content (high impact, moderate effort)
3. Heading structure issues (moderate impact, easy fix)
4. Technical SEO gaps (varies)

## Output format

Title the issue: `[seo-audit] {month} {year} — {count} recommendations`

Structure as:

### Summary
Brief overview with counts by category and estimated effort levels.

### 🔴 High Priority
Items that meaningfully impact search visibility. Include the file path and specific suggested change.

### 🟡 Medium Priority
Improvements worth making but less urgent.

### 🟢 Low Priority / Nice to Have
Minor optimizations for completeness.

For each finding, include:
- File path
- Current state (e.g., "Description is 47 characters: '...'")
- Recommended change (e.g., "Expand to: '...' (155 characters)")
