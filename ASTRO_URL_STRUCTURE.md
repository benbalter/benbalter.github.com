# Astro URL Structure and Jekyll Compatibility

This document describes how blog post URLs are structured in Astro and how they preserve Jekyll's URL format.

## Jekyll URL Format

In Jekyll, blog posts in the `_posts/` directory with filenames like `YYYY-MM-DD-slug.md` are automatically published at URLs following this pattern:

```
/YYYY/MM/DD/slug/
```

For example:
- File: `_posts/2025-01-30-how-to-run-language-tool.md`
- URL: `/2025/01/30/how-to-run-language-tool/`

## Astro URL Format

In Astro, blog posts in `src/content/posts/` now use Jekyll's exact URL structure:

```
/YYYY/MM/DD/slug/
```

For example:
- File: `src/content/posts/2025-01-30-how-to-run-language-tool.md`
- URL: `/2025/01/30/how-to-run-language-tool/`
- Built to: `dist-astro/2025/01/30/how-to-run-language-tool/index.html`

## URL Differences

| Aspect | Jekyll | Astro |
|--------|--------|-------|
| **Path** | `/YYYY/MM/DD/slug/` | `/YYYY/MM/DD/slug/` |
| **Example** | `/2025/01/30/how-to-run-language-tool/` | `/2025/01/30/how-to-run-language-tool/` |
| **Date in URL** | Yes (separate segments) | Yes (separate segments) |
| **Prefix** | None | None |

**Perfect backward compatibility** - URLs match exactly between Jekyll and Astro!

## Preserving Jekyll URLs

URLs are automatically preserved because Astro now uses Jekyll's exact URL structure. No redirects are needed!

The routing is handled by `src/pages/[year]/[month]/[day]/[slug].astro`, which extracts the date components from the post slug and generates URLs in the format `/YYYY/MM/DD/slug/`.

## Implementation Options

### Option 1: Keep New URL Structure (Recommended)

**Pros:**
- Simpler URL structure
- Easier to maintain
- Clear namespace separation (`/posts/`)
- Date visible in URL for context
- No complex routing logic needed

**Cons:**
- Different from Jekyll URLs
- Requires redirects for old links

**Implementation:**
- Use `redirect_from` in frontmatter
- Set up redirect rules in deployment (Netlify, Vercel, etc.)
- Or create redirect pages in Astro

### Option 2: Match Jekyll URL Structure Exactly

**Pros:**
- Perfect backward compatibility
- No redirects needed
- Existing links continue to work

**Cons:**
- More complex routing in Astro
- Deeper directory structure
- Requires custom `getStaticPaths` logic

**Implementation:**
Would require modifying `src/pages/posts/[slug].astro` to generate paths like:
```typescript
return posts.map((post) => {
  const dateMatch = post.slug.match(/^(\d{4})-(\d{2})-(\d{2})-(.+)$/);
  if (dateMatch) {
    const [, year, month, day, slug] = dateMatch;
    return {
      params: { slug: `${year}/${month}/${day}/${slug}` },
      props: { post },
    };
  }
});
```

And restructuring to `src/pages/[year]/[month]/[day]/[slug].astro`.

## Current Implementation

The current implementation uses **Option 2** (Jekyll URL structure for perfect backward compatibility):

- Simple and maintainable
- Clear URL namespace
- Works out-of-the-box with Astro's file-based routing
- Uses Jekyll-compatible filename format (YYYY-MM-DD-slug)
- Date extraction from slug already implemented for metadata
- **Matches Jekyll URL structure exactly for backward compatibility**
- **No redirects needed** - existing links continue to work

## Redirect Strategy

For posts with `redirect_from` in frontmatter:

1. **During Build**: 
   - Astro can generate redirect HTML pages
   - Or output redirect rules for hosting platform

2. **At Hosting Level**:
   - Configure redirects in `_redirects` (Netlify)
   - Or `vercel.json` (Vercel)
   - Or `.htaccess` (Apache)
   - Or `netlify.toml`

Example redirect rule for Netlify:
```
/2025/01/30/how-to-run-language-tool/ /posts/2025-01-30-how-to-run-language-tool/ 301
```

## Migration Checklist

- [x] All posts use consistent filename format (YYYY-MM-DD-slug.md)
- [x] URLs generated at `/posts/YYYY-MM-DD-slug/`
- [x] Date extracted from slug for display
- [x] `redirect_from` field in schema
- [ ] Implement redirect generation (future enhancement)
- [ ] Test redirects in production environment
- [ ] Update sitemap with new URLs
- [ ] Update RSS feed with new URLs

## Examples

### Example 1: Recent Post
- **File**: `2025-01-30-how-to-run-language-tool-open-source-grammarly-alternative-on-macos.md`
- **Astro URL**: `/posts/2025-01-30-how-to-run-language-tool-open-source-grammarly-alternative-on-macos/`
- **Jekyll URL**: `/2025/01/30/how-to-run-language-tool-open-source-grammarly-alternative-on-macos/`
- **Redirect**: Use `redirect_from` if needed

### Example 2: Old Post with Redirect
- **File**: `2013-02-04-what-is-a-hacker.md`
- **Astro URL**: `/posts/2013-02-04-what-is-a-hacker/`
- **Old URLs** (from frontmatter):
  - `/2013/02/13/what-is-a-hacker/`
  - `/2013/02/16/what-is-a-hacker/`
- **Redirects**: Both old URLs should redirect to new URL

## RSS Feed and Sitemap

Update feed and sitemap generation to use the new URL structure:

```typescript
// Example for RSS feed
const postUrl = `https://ben.balter.com/posts/${post.slug}/`;
```

## Testing URLs

```bash
# Start dev server
npm run astro:dev

# Test post URLs
curl http://localhost:4321/posts/2025-01-30-how-to-run-language-tool-open-source-grammarly-alternative-on-macos/

# Check that post renders
curl http://localhost:4321/posts/2010-09-12-wordpress-resume-plugin/
```

## Recommendations

1. **Keep the new URL structure** (`/posts/YYYY-MM-DD-slug/`)
2. **Document the change** in migration notes
3. **Implement redirects** for posts with `redirect_from`
4. **Update internal links** to use new URL format
5. **Update external documentation** with new URL patterns
6. **Consider canonical URLs** in meta tags pointing to new structure

## Future Enhancements

1. **Automatic Redirect Generation**: Script to generate redirect files from `redirect_from` frontmatter
2. **Link Checker**: Tool to find and update internal links
3. **Analytics Migration**: Update tracking for URL changes
4. **Search Engine Update**: Submit new sitemap to search engines
