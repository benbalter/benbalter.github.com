import { remark } from 'remark';
import gfm from 'remark-gfm';
import remarkGithub from 'remark-github';
import remarkRehype from 'remark-rehype';
import rehypeRaw from 'rehype-raw';
import rehypeSanitize, { defaultSchema } from 'rehype-sanitize';
import rehypeSlug from 'rehype-slug';
import rehypeAutolinkHeadings from 'rehype-autolink-headings';
import rehypeStringify from 'rehype-stringify';
import { convert } from 'html-to-text';
import { processEmoji } from './emoji';
import { getSiteConfig } from './config';
import type { Schema } from 'hast-util-sanitize';

/**
 * Converts markdown to sanitized HTML string at build time.
 * Optimized for Static Site Generation (SSG).
 * 
 * Benefits:
 * - Processes markdown once at build time, not on every page load
 * - Smaller client-side bundle (no react-markdown dependency)
 * - Automatic sanitization for security
 * - Better performance for static sites
 */
export async function markdownToHtml(markdown: string): Promise<string> {
  // Process emoji before markdown conversion
  const markdownWithEmoji = processEmoji(markdown);
  
  // Get repository info for remark-github
  const config = getSiteConfig();
  const [owner, repo] = config.repository ? config.repository.split('/') : ['', ''];
  
  // Create custom sanitization schema that allows our anchor link classes
  // We need to extend the className property to include our custom classes
  const sanitizeSchema: Schema = {
    ...defaultSchema,
    attributes: {
      ...defaultSchema.attributes,
      a: [
        ...(defaultSchema.attributes?.a || []).filter(
          attr => !(Array.isArray(attr) && attr[0] === 'className')
        ),
        // Allow specific class names for anchor links
        ['className', 'anchor-link', 'data-footnote-backref'],
      ],
      span: [
        ...(defaultSchema.attributes?.span || []),
        // Allow anchor-icon class for the span inside anchor links
        ['className', 'anchor-icon'],
      ],
    },
  };
  
  const result = await remark()
    .use(gfm)
    // Use remark-github plugin for @mentions, #issues, and other GitHub references
    .use(remarkGithub, {
      repository: config.repository || `${owner}/${repo}`,
      mentionStrong: false, // Don't make mentions bold
    })
    // Convert markdown to HTML AST (hast)
    .use(remarkRehype, { allowDangerousHtml: true })
    // Allow raw HTML in markdown
    .use(rehypeRaw)
    // Add IDs to headings (must come before rehype-autolink-headings)
    .use(rehypeSlug)
    // Add anchor links to headings with GitHub-style behavior
    .use(rehypeAutolinkHeadings, {
      behavior: 'append',
      properties: {
        className: ['anchor-link'],
        ariaLabel: 'Link to this section',
      },
      content: {
        type: 'element',
        tagName: 'span',
        properties: { className: ['anchor-icon'] },
        children: [{ type: 'text', value: ' #' }],
      },
    })
    // Sanitize HTML for security with custom schema (should be after all other rehype plugins)
    .use(rehypeSanitize, sanitizeSchema)
    // Convert hast to HTML string
    .use(rehypeStringify)
    .process(markdownWithEmoji);
  
  return result.toString();
}

/**
 * Converts HTML to plain text using a proper HTML parser.
 * Handles HTML comments, script/style tags, and complex edge cases correctly.
 */
export function stripHtml(htmlString: string): string {
  return convert(htmlString, {
    wordwrap: false,
    preserveNewlines: false,
    selectors: [
      { selector: 'a', options: { ignoreHref: true } },
      { selector: 'img', format: 'skip' },
    ],
  });
}
