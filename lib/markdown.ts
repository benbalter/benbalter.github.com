import { remark } from 'remark';
import html from 'remark-html';
import remarkGfm from 'remark-gfm';

/**
 * Convert markdown to HTML
 * Note: HTML sanitization is disabled to allow formatting from trusted blog post content.
 * All content comes from _posts/ directory which is controlled by the site owner.
 */
export async function markdownToHtml(markdown: string): Promise<string> {
  const result = await remark()
    .use(remarkGfm)
    .use(html, { sanitize: false })
    .process(markdown);
  
  return result.toString();
}
