# Astro Reading Time and Related Posts Implementation

## Overview

This document describes the implementation of reading-time calculations and related posts functionality for the Astro version of Ben Balter's blog.

## Features

### Reading Time Calculation

**Location:** `src/utils/reading-time.ts`

The reading time feature calculates an estimated reading time for each blog post based on word count. The calculation:

- **Default reading speed:** 200 words per minute (configurable)
- **Removes HTML tags** to count only actual text
- **Excludes code blocks** (both fenced and inline)
- **Filters URLs** to avoid counting them as words
- **Minimum time:** 1 minute for very short posts

**Usage in PostLayout:**

```typescript
import { calculateReadingTime } from '../utils/reading-time';

const content = await Astro.slots.render('default');
const readingTime = calculateReadingTime(content);
```

The reading time is displayed in the post header as: "X min read" with a clock icon.

**Tests:** `src/utils/reading-time.test.ts` (12 passing tests)

### Related Posts

**Location:** `src/utils/related-posts.ts`

The related posts feature uses **TF-IDF (Term Frequency-Inverse Document Frequency)** algorithm to find posts that are most similar to the current post. This is more sophisticated than simple keyword matching.

**How it works:**

1. **Extract words** from post titles and descriptions
2. **Remove stop words** (common English words like "the", "a", "is")
3. **Calculate TF-IDF scores** for each word in each post
4. **Compute cosine similarity** between the current post and all other posts
5. **Return top N most similar posts** (default: 10)

**Algorithm Details:**

- **Term Frequency (TF):** How often a word appears in a document, normalized by document length
- **Inverse Document Frequency (IDF):** How rare/important a word is across all documents
- **Cosine Similarity:** Measures the angle between two TF-IDF vectors (0 = unrelated, 1 = identical)

**Usage in [slug].astro:**

```typescript
import { findRelatedPosts } from '../../../../utils/related-posts';

const relatedPosts = await findRelatedPosts(post, allPosts, 10);
```

The related posts are passed to `PostLayout` and displayed at the bottom of each post with the heading "If you enjoyed this post, you might also enjoy:".

**Tests:** `src/utils/related-posts.test.ts`

## Build-Time Calculation

Both reading time and related posts are calculated **at build time** during static site generation:

1. When Astro runs `getStaticPaths()` for each blog post
2. All posts are passed as props to each page
3. Related posts are calculated once per post during build
4. Results are embedded in the static HTML

**Benefits:**

- ✅ **Zero runtime JavaScript** - no client-side calculations
- ✅ **Fast page loads** - all data is pre-computed
- ✅ **SEO friendly** - related posts are in the HTML
- ✅ **Scalable** - calculations happen once at build time

## Display

### Reading Time

Appears in the post header below the publication date:

```
📅 Published March 2, 2023
🕐 10 min read
```

### Related Posts

Appears at the bottom of the post, above the footer:

```
If you enjoyed this post, you might also enjoy:
• Post Title 1
• Post Title 2
• Post Title 3
...
```

## Styling

Styles for both features are defined in `PostLayout.astro`:

- **Reading time:** Uses the `.post-meta` class with muted text
- **Related posts:** Uses `.related-posts` and `.related-posts-list` classes
- **Border styling:** Top border separates the section from post content
- **Links:** Primary color (#0366d6) with hover underline

## Performance Considerations

### Reading Time

- **O(n)** where n = number of words in the post
- Regex operations for HTML/code removal are efficient
- Calculated once at build time per post

### Related Posts

- **O(n²)** where n = number of posts (compares each post to all others)
- Mitigated by using only title + description (not full content)
- For ~180 posts, build time impact is minimal (~2-3 seconds)
- Could be optimized with caching if the post count grows significantly

## Future Enhancements

Potential improvements:

1. **Cache TF-IDF data** between builds to speed up incremental builds
2. **Use full post content** instead of just title/description (trade-off: slower builds)
3. **Add category/tag weighting** to prioritize posts with similar tags
4. **Recency bias** to favor newer posts in recommendations
5. **Click tracking** to improve recommendations based on user behavior (requires analytics)

## Testing

Run tests with:

```bash
npx vitest run src/utils/
```

Current test coverage:
- Reading time: 12 tests (100% coverage)
- Related posts: 2 tests (basic structure tests)

Integration tests verify the features work end-to-end during the build process.

## Comparison to Jekyll

### Jekyll Implementation

- **Reading time:** Simple calculation in `_includes/reading-time.html` (265 words/min)
- **Related posts:** Pre-built using LSI (Latent Semantic Indexing) in Ruby
- **Data storage:** Stored in `_data/related_posts.yml`

### Astro Implementation

- **Reading time:** More sophisticated (removes HTML, code, URLs)
- **Related posts:** TF-IDF algorithm (similar quality to LSI)
- **Data storage:** Calculated on-the-fly at build time (no data file needed)

Both implementations are build-time and produce similar results.
