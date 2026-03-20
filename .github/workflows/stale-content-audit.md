---
on:
  schedule: weekly on monday around 9:00 utc-5
  skip-if-match: 'is:issue is:open in:title "[content-audit]"'
permissions:
  contents: read
safe-outputs:
  create-issue:
    title-prefix: "[content-audit] "
    labels: [content, maintenance]
    close-older-issues: true
    expires: 14d
---

## Weekly Stale Content Audit

Review all blog posts in `src/content/posts/` for quality and freshness issues. The site has 150+ posts dating back to 2010, so staleness is a real concern.

## What to check

### Broken or suspect links
- External links to documentation sites (GitHub Docs, MDN, etc.) that may have moved
- Links to third-party tools, services, or companies that may no longer exist
- Links to government websites (a common topic) that frequently reorganize

### Outdated content
- References to specific software versions that are now significantly outdated (e.g., "Ruby 2.x", "Node 12", "Jekyll 3")
- Mentions of tools, services, or platforms that have been deprecated, acquired, or shut down
- Advice or best practices that have materially changed in the industry
- Statistics or data points that are likely stale (anything with a year reference older than 3 years)

### Front matter gaps
- Posts missing a `description` field (hurts SEO and social sharing)
- Posts with very short descriptions (under 100 characters)

## Prioritization

Focus on the **10 most impactful findings**, prioritized by:
1. Broken links (reader-facing problem)
2. Factually outdated content (credibility risk)
3. Missing metadata (SEO impact)

Skip minor style or formatting issues — those are handled by the CI linters.

## Output format

Title the issue: `[content-audit] Week of {date} — {count} findings`

Organize findings as a task list grouped by category:

### 🔗 Broken/Suspect Links
- [ ] `src/content/posts/YYYY-MM-DD-slug.md` — Link to `example.com/path` appears broken (line ~N)

### 📅 Outdated Content
- [ ] `src/content/posts/YYYY-MM-DD-slug.md` — References Node 12 which is EOL; current LTS is Node 22

### 📝 Metadata Gaps
- [ ] `src/content/posts/YYYY-MM-DD-slug.md` — Missing `description` front matter

Include a brief summary at the top with total findings by category.
