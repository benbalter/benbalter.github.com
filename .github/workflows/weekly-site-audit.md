---
on:
  schedule:
    - cron: "0 9 * * MON"
  workflow_dispatch:
permissions:
  contents: read
  issues: read
  pull-requests: read
safe-outputs:
  create-issue:
    title-prefix: "[site-audit] "
    labels: [audit, automated]
    close-older-issues: true
---

## Weekly Site Health Audit

You are auditing the personal blog of Ben Balter (ben.balter.com), an Astro static site hosted on GitHub Pages.

### What to check

1. **Structured data**: Validate JSON-LD schemas in `src/utils/structured-data.ts` and `src/layouts/BaseLayout.astro` against Google's supported types. Check that `BlogPosting`, `ProfilePage`, `Person`, `WebSite`, and `BreadcrumbList` schemas are present and well-formed.

2. **Accessibility (contrast)**: Scan all `.astro` files in `src/components/`, `src/layouts/`, and `src/pages/` for Tailwind color classes with poor contrast. Flag any `text-gray-400`, `text-gray-500`, or `dark:text-gray-400` used for readable text (not decorative elements).

3. **SEO meta tags**: Check `src/layouts/BaseLayout.astro` for completeness of Open Graph tags (including `og:image:width`, `og:image:height`, `og:image:alt`), Twitter Card tags (including `twitter:image:alt`), and canonical URLs.

4. **Heading hierarchy**: Check all page and layout files for proper heading hierarchy (single `h1` per page, no skipped levels like `h1` → `h3`).

5. **Image alt text**: Check Astro components for `<img>` or `<Image>` tags missing `alt` attributes.

6. **Dead code**: Look for unused imports, unreferenced files in `src/scripts/` and `src/components/`, and exported functions with no consumers.

7. **Test health**: Review `src/utils/*.test.ts` for any test assertions that contradict the actual implementation (e.g., wrong expected values).

### Output format

Create a GitHub issue summarizing findings, organized by category. For each finding:
- State the file path and line number
- Describe the issue concisely
- Suggest a specific fix

Only report genuine issues. If a category has no issues, say "No issues found" and move on. Prioritize findings as Critical, High, or Low.
