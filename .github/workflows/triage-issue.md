---
on:
  issues:
    types: [opened]
permissions:
  contents: read
  issues: read
safe-outputs:
  noop:
    report-as-issue: false
  add-labels:
    allowed: [bug, enhancement, documentation, question, accessibility, seo, performance, content]
    max: 3
  add-comment:
    max: 1
---

## Issue Triage

A new issue has been opened on the personal blog repository of Ben Balter (ben.balter.com), an Astro static site.

### Instructions

1. **Read the issue** carefully to understand what is being reported or requested.

2. **Apply labels** (up to 3) from the allowed list based on the issue content:
   - `bug` — Something is broken or not working as expected
   - `enhancement` — A new feature or improvement request
   - `documentation` — Changes to docs, README, or Copilot instructions
   - `question` — A question about the site or codebase
   - `accessibility` — Accessibility or WCAG compliance issues
   - `seo` — SEO, structured data, or search visibility issues
   - `performance` — Performance, Core Web Vitals, or loading speed
   - `content` — Blog post content, typos, or writing issues

3. **Investigate the codebase** to verify the issue if it references specific files or behavior. Check if the issue is valid and if there's an obvious fix.

4. **Post a brief comment** acknowledging the issue. If you found relevant code, mention the file(s) involved and whether a fix looks straightforward. Keep the tone professional and welcoming.

### Important

- Do NOT attempt to fix the issue or create a PR
- Do NOT add labels that aren't in the allowed list
- Be concise — the comment should be 2-4 sentences max
