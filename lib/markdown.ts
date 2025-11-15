import { remark } from 'remark';
import html from 'remark-html';
import gfm from 'remark-gfm';
import { convert } from 'html-to-text';

export async function markdownToHtml(markdown: string): Promise<string> {
  const result = await remark()
    .use(gfm)
    // Sanitization is intentionally disabled because all Markdown content is trusted
    // (authored by the site owner). This allows embedding custom HTML in blog posts and pages.
    .use(html, { sanitize: false })
    .process(markdown);
  
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
