import { remark } from 'remark';
import gfm from 'remark-gfm';
import remarkGithub from 'remark-github';
import remarkRehype from 'remark-rehype';
import rehypeRaw from 'rehype-raw';
import rehypeSanitize, { defaultSchema } from 'rehype-sanitize';
import rehypeStringify from 'rehype-stringify';
import { convert } from 'html-to-text';
import { processEmoji } from './emoji';
import { getSiteConfig } from './config';

/**
 * Converts inline markdown to sanitized HTML string at build time.
 * 
 * This is specifically for short text like descriptions where:
 * - Full MDX compilation is overkill
 * - We need an HTML string (not React elements)
 * - Heading slugs aren't needed
 * 
 * For post content, use MarkdownContent component with compileMDX instead.
 * 
 * @param markdown - The inline markdown content to convert
 */
export async function inlineMarkdownToHtml(markdown: string): Promise<string> {
  // Process emoji before markdown conversion
  const markdownWithEmoji = processEmoji(markdown);
  
  // Get repository info for remark-github
  const config = getSiteConfig();
  
  const result = await remark()
    .use(gfm)
    // Use remark-github plugin for @mentions, #issues, and other GitHub references
    .use(remarkGithub, {
      repository: config.repository,
      mentionStrong: false, // Don't make mentions bold
    })
    // Convert markdown to HTML AST (hast)
    .use(remarkRehype, { allowDangerousHtml: true })
    // Allow raw HTML in markdown
    .use(rehypeRaw)
    // Sanitize HTML for security
    .use(rehypeSanitize, defaultSchema)
    // Convert hast to HTML string
    .use(rehypeStringify)
    .process(markdownWithEmoji);
  
  // Remove wrapping <p> tags for inline usage (only for single paragraph content)
  // The [^]* pattern matches any character without crossing multiple paragraphs unintentionally
  // We use a non-greedy match and ensure no nested <p> tags
  const html = result.toString();
  const singleParagraphMatch = html.match(/^<p>([^]*?)<\/p>\n?$/);
  if (singleParagraphMatch && !singleParagraphMatch[1]?.includes('<p>')) {
    return singleParagraphMatch[1] ?? html;
  }
  return html;
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
