---
on:
  schedule:
    - cron: "0 9 1 */3 *"
  workflow_dispatch:
permissions:
  contents: read
  issues: read
safe-outputs:
  create-issue:
    title-prefix: "[content-review] "
    labels: [content, automated]
    close-older-issues: true
---

## Quarterly Stale Content Review

Review blog posts on Ben Balter's personal site (ben.balter.com) for content that may need updating.

### What to check

1. **Outdated references**: Scan posts in `src/content/posts/` for:
   - References to specific software versions that may be outdated (e.g., "Node.js 16", "React 17")
   - Links to external URLs that may have changed (look for common patterns like deprecated domains)
   - References to Ben's job title or role that don't match the current config in `src/config.ts`
   - Mentions of tools or services that have been discontinued

2. **Archived posts without the flag**: Check if any old posts (3+ years) discuss time-sensitive topics (specific product launches, conference talks, policy changes) but aren't marked `archived: true` in their frontmatter.

3. **Broken internal links**: Check post content for internal links (paths starting with `/`) and verify the target pages exist in `src/content/posts/`, `src/content/pages/`, or `src/pages/`.

4. **Missing descriptions**: Find any posts in `src/content/posts/` where the `description` frontmatter field is empty, very short (under 50 characters), or missing.

### Output format

Create a GitHub issue organized by category. For each finding:
- State the post filename and the specific line or content
- Explain why it may be stale
- Suggest a specific update

Focus on high-confidence findings. Don't flag posts about historical events or evergreen advice just because they're old — flag them only if they contain specific claims that are likely no longer accurate.
