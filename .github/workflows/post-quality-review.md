---
on:
  pull_request:
    types: [opened, synchronize]
  reaction: "eyes"
permissions:
  contents: read
  pull-requests: read
safe-outputs:
  noop:
    report-as-issue: false
  add-comment:
    max: 1
---

## Blog Post Quality Review

When a pull request includes new or modified files in `src/content/posts/`, perform a quality review focused on SEO, internal linking, and content structure.

**If no files in `src/content/posts/` are changed in the PR, skip the review entirely and do nothing.**

Do NOT flag issues already caught by the project's automated linters (Vale, textlint, remark, markdownlint, Harper). Focus exclusively on higher-level concerns those tools cannot detect.

## Review areas

### Front matter quality
- **Title**: Is it compelling and SEO-friendly? Ideal length is 50-60 characters. Avoid clickbait.
- **Description**: Is it present, compelling, and 150-160 characters? It appears in search results and social cards.
- **Permalink**: If present, does it use a clean, descriptive URL slug?

### Content structure
- Does the opening paragraph clearly state what the reader will learn or gain?
- Do headings follow a logical hierarchy (h2 → h3, no skipping levels)?
- Are paragraphs reasonably sized (not walls of text)?
- Does the post have a clear conclusion or call to action?

### Internal linking opportunities
- Review existing posts in `src/content/posts/` and identify 2-4 that are topically related and could be linked from this post
- The author's key themes include: technology leadership, open source, remote work, collaboration, "showing your work", "communications debt", government technology
- Also suggest existing posts that could add a link *back* to this new post
- Format link suggestions as markdown: `[suggested anchor text](/YYYY/MM/DD/slug/)`

### SEO assessment
- Does the title include the primary topic/keyword?
- Are headings descriptive and keyword-relevant (not generic like "Introduction" or "Conclusion")?
- Is the content substantial enough to rank (generally 800+ words for informational content)?

### Readability
- Is the tone analytical yet accessible, consistent with the author's voice?
- Are technical concepts explained for a broad audience?
- Are there opportunities to add examples, analogies, or concrete illustrations?

## Comment format

Post a single review comment structured as:

### 📝 Content Review

**Overall:** One-sentence assessment (e.g., "Strong post with a few opportunities to improve discoverability")

**Suggestions:** (only include sections where you have actionable feedback)

- 🔍 **SEO**: Title/description/heading feedback
- 🔗 **Internal links**: Specific linking suggestions with paths
- 📐 **Structure**: Any structural improvements
- 💡 **Content**: Higher-level content suggestions

Keep feedback constructive, specific, and actionable. Skip sections with no issues.
