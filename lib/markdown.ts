import { remark } from 'remark';
import gfm from 'remark-gfm';
import remarkGithub from 'remark-github';
import remarkRehype from 'remark-rehype';
import rehypeSlug from 'rehype-slug';
import rehypeAutolinkHeadings from 'rehype-autolink-headings';
import rehypeStringify from 'rehype-stringify';
import { convert } from 'html-to-text';
import { processEmoji } from './emoji';
import { getSiteConfig } from './config';

export async function markdownToHtml(markdown: string): Promise<string> {
  // Process emoji before markdown conversion
  const markdownWithEmoji = processEmoji(markdown);
  
  // Get repository info for remark-github
  const config = getSiteConfig();
  const [owner, repo] = config.repository ? config.repository.split('/') : ['', ''];
  
  const result = await remark()
    .use(gfm)
    // Use remark-github plugin for @mentions, #issues, and other GitHub references
    .use(remarkGithub, {
      repository: config.repository || `${owner}/${repo}`,
      mentionStrong: false, // Don't make mentions bold
    })
    // Convert markdown to HTML AST (hast)
    .use(remarkRehype, { allowDangerousHtml: true })
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
    // Convert hast to HTML string
    .use(rehypeStringify, { allowDangerousHtml: true })
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
