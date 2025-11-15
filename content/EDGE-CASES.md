# Jekyll to Next.js Content Migration - Edge Cases

## Posts Without Titles

Three posts have descriptions but no explicit titles. The titles are inferred from filenames:

1. `2013-08-11-everyone-contributes.md` - Everyone Contributes
2. `2013-09-16-treat-data-as-code.md` - Treat Data as Code
3. `2013-09-30-ten-things-you-learn-as-a-presidential-innovation-fellow.md` - Ten Things You Learn as a Presidential Innovation Fellow

**Next.js Implementation Note**: Generate titles from filenames when the `title` field is missing. Use the pattern:

```javascript
function getTitleFromFilename(filename) {
  return filename
    .replace(/^\d{4}-\d{2}-\d{2}-/, '') // Remove date prefix
    .replace(/\.md$/, '')                // Remove extension
    .replace(/-/g, ' ')                  // Replace hyphens with spaces
    .replace(/\b\w/g, l => l.toUpperCase()); // Capitalize words
}
```

## HTML Pages

Two HTML pages were migrated and will need special handling:

### index.html

* **Original**: Jekyll homepage with Liquid templates
* **Migrated to**: `content/pages/index.html`
* **Recommendation**: Convert to React component or Markdown

### other-recommended-reading.html

* **Original**: Jekyll page with Liquid templates
* **Migrated to**: `content/pages/other-recommended-reading.html`
* **Recommendation**: Convert to React component or Markdown

## Liquid Template Tags Requiring Replacement

### Common Patterns Found

1. **Includes**:
   * `{% include_cached github-culture.html %}`
   * `{% include callout.html content=update %}`
   * `{% include foss-at-scale.html nth="second" %}`
   * `{% include contact-links.html %}`

2. **Loops**:
   * `{% for url in page.posts %}`
   * `{% endfor %}`

3. **Variables**:
   * `{% capture update %}`
   * `{% endcapture %}`

4. **Filters**:
   * `{{ post.title }}`
   * `{{ post.url | absolute_url }}`
   * `{{ post.description | markdownify | strip_html }}`

### Recommended Next.js Replacements

```javascript
// Include → React Component
{% include github-culture.html %} 
→ <GitHubCulture />

// Loop → map()
{% for post in posts %}
  <li>{{ post.title }}</li>
{% endfor %}
→ {posts.map(post => <li key={post.slug}>{post.title}</li>)}

// Filters → JavaScript functions
{{ text | markdownify }}
→ {markdownToHtml(text)}

{{ text | strip_html }}
→ {stripHtml(text)}

{{ url | absolute_url }}
→ {new URL(url, siteUrl).toString()}
```

## Frontmatter Edge Cases

### Multiple Values in redirect_from

Example from `2023-12-08-cathedral-bazaar-management.md`:

```yaml
_legacy_redirect_from:
  - "/2023/12/07/cathedral-bazaar-management/"
```

Some posts have multiple redirect URLs. Next.js should handle all redirects.

### SEO Field (Rare)

Only one page uses the `seo` field:

* `content/pages/about.md`: `seo: { type: person }`

This should be converted to Next.js metadata or JSON-LD.

### Custom Fields

Some posts have unique fields that should be preserved:

* `posts` (array): Used in "what-to-read-before-starting-or-interviewing-at-github.md"
* `roles` (array): Used in the same post
* `icons` (boolean): Used in contact.md and about.md

## Data File Considerations

### books.yml Structure

```yaml
Category Name:
  - title: Book Title
    asin: Amazon ASIN
    tldr: Short description
```

**Usage**: Display book recommendations grouped by category.

### clips.yml Structure

```yaml
- title: Article Title
  publication: Publication Name
  url: Article URL
  date: YYYY-MM-DD
```

**Usage**: Display press mentions sorted by date.

### related_posts.yml Structure

```yaml
post-slug-without-date:
  - another-post-slug
  - yet-another-slug
```

**Usage**: Show related posts for each blog post.

## URL Structure Considerations

Jekyll permalinks follow the pattern: `/YYYY/MM/DD/title/`

Next.js should implement matching routes:

```
app/[year]/[month]/[day]/[slug]/page.tsx
```

Or use Next.js redirects/rewrites in `next.config.js`:

```javascript
async redirects() {
  return [
    {
      source: '/:year/:month/:day/:slug',
      destination: '/posts/:slug',
      permanent: true,
    },
  ];
}
```

## Character Encoding

All files are UTF-8 encoded. Some posts contain:

* Em dashes (—)
* En dashes (–)
* Smart quotes (" " ' ')
* Emoji (via jemoji plugin)
* Special characters

Ensure Next.js handles UTF-8 properly and consider emoji replacement libraries.

## Footnotes

Several posts use Markdown footnotes (`[^1]`, `[^2]`). Ensure the Markdown processor supports footnotes:

```bash
npm install remark-footnotes
```

## Image References

Posts reference images via:

1. GitHub URLs: `https://github.com/benbalter/benbalter.github.com/assets/...`
2. Relative URLs: `/assets/...`

Ensure Next.js handles both formats correctly with the Image component.

## Date Format Consistency

All dates in frontmatter are now strings in `YYYY-MM-DD` format (quoted in YAML).
When parsing, convert to Date objects:

```javascript
const date = new Date(frontmatter.date);
```

## Testing Recommendations

1. **Validate all posts parse correctly**: Test frontmatter parsing
2. **Check URLs match Jekyll permalinks**: Verify routing
3. **Test Markdown rendering**: Ensure all Markdown features work
4. **Verify data file loading**: Test YAML parsing
5. **Check special characters**: Test UTF-8 handling
6. **Test image loading**: Verify image paths resolve
7. **Validate redirects**: Ensure old URLs redirect properly

## Migration Statistics

* **Total files migrated**: 206
* **Posts with liquid tags**: 28
* **Posts with redirects**: 16
* **Posts without titles**: 3
* **HTML pages**: 2
* **Data files**: 3
* **Resume positions**: 10
* **Regular pages**: 9
* **Blog posts**: 184

## Success Criteria

✅ All content files have valid YAML frontmatter
✅ All body content preserved unchanged
✅ Jekyll-specific fields prefixed with `_legacy_`
✅ Dates extracted from filenames for posts
✅ Original files preserved in repository
✅ Comprehensive documentation created
✅ Edge cases identified and documented
