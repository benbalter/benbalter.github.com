import { remark } from 'remark';
import html from 'remark-html';
import gfm from 'remark-gfm';

export async function markdownToHtml(markdown: string): Promise<string> {
  const result = await remark()
    .use(gfm)
    // Sanitization is intentionally disabled because all Markdown content is trusted
    // (authored by the site owner). This allows embedding custom HTML in blog posts and pages.
    .use(html, { sanitize: false })
    .process(markdown);
  
  return result.toString();
}

export function stripHtml(htmlString: string): string {
  return htmlString.replace(/<[^>]*>/g, '');
}
