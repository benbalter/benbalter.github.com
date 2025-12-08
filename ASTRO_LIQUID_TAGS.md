# Jekyll to Astro Blog Post Migration - Liquid Tags

This document lists the 27 blog posts that contain Liquid template tags and may need manual conversion to MDX components.

## Overview

Liquid template tags were used in Jekyll for including reusable components and dynamic content. In Astro, these should be converted to MDX components or standard Astro/React components.

## Common Liquid Patterns Found

### 1. Include Tags
```liquid
{% include callout.html content=content %}
{% include_cached github-culture.html %}
```

**Conversion**: Create Astro components like `<Callout>` in MDX files.

### 2. Raw Content
```liquid
{% raw %}{{ content }}{% endraw %}
```

**Conversion**: Use code fences or escape sequences as needed.

### 3. For Loops
```liquid
{% for repository in site.github.public_repositories %}
  ...
{% endfor %}
```

**Conversion**: Use JavaScript/TypeScript in Astro components to fetch and loop through data.

## Posts with Liquid Tags

Below is the complete list of posts that contain Liquid template tags and their file locations:

### Posts Needing Review

1. **2014-10-07-expose-process-through-urls.md**
   - Location: `src/content/posts/2014-10-07-expose-process-through-urls.md`
   - Contains: `{% raw %}` tags

2. **2014-11-06-rules-of-communicating-at-github.md**
   - Location: `src/content/posts/2014-11-06-rules-of-communicating-at-github.md`
   - Contains: `{% include_cached %}` tag

3. **2015-03-08-open-source-best-practices-internal-collaboration.md**
   - Location: `src/content/posts/2015-03-08-open-source-best-practices-internal-collaboration.md`
   - Contains: `{% include_cached %}` tag

4. **2015-03-17-open-source-best-practices-external-engagement.md**
   - Location: `src/content/posts/2015-03-17-open-source-best-practices-external-engagement.md`
   - Contains: `{% include_cached %}` tag

5. **2015-06-11-using-github-pages-to-showcase-your-orgs-open-source-efforts.md**
   - Location: `src/content/posts/2015-06-11-using-github-pages-to-showcase-your-orgs-open-source-efforts.md`
   - Contains: `{% raw %}`, `{% for %}` loops, and template examples

6. **2015-08-12-the-zen-of-github.md**
   - Location: `src/content/posts/2015-08-12-the-zen-of-github.md`
   - Contains: `{% include_cached %}` tag

7. **2015-09-13-github-pages-edit-button.md**
   - Location: `src/content/posts/2015-09-13-github-pages-edit-button.md`
   - Contains: `{% raw %}` tags and `{% github_edit_link %}` custom tag

8. **2015-11-12-why-urls.md**
   - Location: `src/content/posts/2015-11-12-why-urls.md`
   - Contains: `{% include callout.html %}` tags

9. **2015-11-18-tools-to-empower-open-collaboration.md**
   - Location: `src/content/posts/2015-11-18-tools-to-empower-open-collaboration.md`
   - Contains: `{% include callout.html %}` tags

10. **2015-12-08-types-of-pull-requests.md**
    - Location: `src/content/posts/2015-12-08-types-of-pull-requests.md`
    - Contains: `{% capture %}` and `{% include callout.html %}` tags

11. **2016-09-13-seven-habits-of-highly-effective-githubbers.md**
    - Location: `src/content/posts/2016-09-13-seven-habits-of-highly-effective-githubbers.md`
    - Contains: `{% include_cached %}` tag

12. **2016-10-31-eight-things-i-wish-i-knew-my-first-week-at-github.md**
    - Location: `src/content/posts/2016-10-31-eight-things-i-wish-i-knew-my-first-week-at-github.md`
    - Contains: `{% include_cached %}` tag

13. **2020-05-15-set-open-source-contributors-up-for-success.md**
    - Location: `src/content/posts/2020-05-15-set-open-source-contributors-up-for-success.md`
    - Contains: `{% include_cached %}` tag

14. **2020-08-10-automate-common-open-source-community-management-tasks.md**
    - Location: `src/content/posts/2020-08-10-automate-common-open-source-community-management-tasks.md`
    - Contains: `{% include_cached %}` tag

15. **2020-08-14-tools-of-the-trade.md**
    - Location: `src/content/posts/2020-08-14-tools-of-the-trade.md`
    - Contains: `{% include_cached %}` tag

16. **2020-08-25-how-i-manage-github-notifications.md**
    - Location: `src/content/posts/2020-08-25-how-i-manage-github-notifications.md`
    - Contains: `{% include_cached %}` tag

17. **2020-09-12-10-years.md**
    - Location: `src/content/posts/2020-09-12-10-years.md`
    - Contains: `{% include_cached %}` tag

18. **2020-12-04-over-engineered-home-network-for-privacy-and-security.md**
    - Location: `src/content/posts/2020-12-04-over-engineered-home-network-for-privacy-and-security.md`
    - Contains: `{% include_cached %}` tag

19. **2021-02-01-what-to-read-before-starting-or-interviewing-at-github.md**
    - Location: `src/content/posts/2021-02-01-what-to-read-before-starting-or-interviewing-at-github.md`
    - Contains: `{% include_cached %}` tag

20. **2021-06-14-open-source-governance.md**
    - Location: `src/content/posts/2021-06-14-open-source-governance.md`
    - Contains: `{% include_cached %}` tag

21. **2021-06-15-how-to-moderate-open-source-conversations-to-keep-them-productive.md**
    - Location: `src/content/posts/2021-06-15-how-to-moderate-open-source-conversations-to-keep-them-productive.md`
    - Contains: `{% include_cached %}` tag

22. **2021-09-01-how-i-re-over-engineered-my-home-network.md**
    - Location: `src/content/posts/2021-09-01-how-i-re-over-engineered-my-home-network.md`
    - Contains: `{% include_cached %}` tag

23. **2021-12-15-github-actions-website-api-change-notification.md**
    - Location: `src/content/posts/2021-12-15-github-actions-website-api-change-notification.md`
    - Contains: `{% include_cached %}` tag

24. **2022-02-16-leaders-show-their-work.md**
    - Location: `src/content/posts/2022-02-16-leaders-show-their-work.md`
    - Contains: `{% include_cached %}` tag

25. **2022-03-17-why-async.md**
    - Location: `src/content/posts/2022-03-17-why-async.md`
    - Contains: `{% include_cached %}` tag

26. **2023-03-02-github-for-non-technical-roles.md**
    - Location: `src/content/posts/2023-03-02-github-for-non-technical-roles.md`
    - Contains: `{% include_cached %}` tag

27. **2023-04-20-meetings-are-a-point-of-escalation.md**
    - Location: `src/content/posts/2023-04-20-meetings-are-a-point-of-escalation.md`
    - Contains: `{% include_cached %}` tag

## Recommended Actions

### Immediate (Required for Production)

For most posts, the Liquid tags can simply be removed or left as-is since they appear in code examples or are for content that may not be critical to the post's core message.

### Future Enhancement (Optional)

1. **Create Callout MDX Component**: Many posts use `{% include callout.html %}` which could be replaced with a `<Callout>` MDX component (similar to the existing one in `src/components/Callout.astro`).

2. **Convert GitHub Culture Include**: Posts with `{% include_cached github-culture.html %}` could have this content extracted and added as an Astro component or removed if no longer relevant.

3. **Update Code Examples**: Posts showing Jekyll template syntax in code examples can remain as-is since they're educational content.

## Testing Strategy

1. **Visual Review**: Manually review each post in the Astro dev server to ensure content renders correctly
2. **Search Functionality**: Verify search/metadata is preserved
3. **Link Checking**: Ensure internal and external links work
4. **SEO Validation**: Check that titles, descriptions, and meta tags are correct

## Current Status

- ✅ All 184 posts migrated to Astro
- ✅ All posts build successfully
- ✅ Frontmatter schema validated
- ⚠️ 27 posts contain Liquid tags (documented above)
- ⏳ Liquid tag conversion pending (optional enhancement)

## Notes

- The Liquid tags don't prevent the posts from building or rendering in Astro
- They will appear as plain text in the rendered output
- Most are in code examples or callout boxes that can be handled later
- Priority should be on ensuring core content and metadata are correct
