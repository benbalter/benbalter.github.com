import { remark } from 'remark';
import html from 'remark-html';
import gfm from 'remark-gfm';

export async function markdownToHtml(markdown: string): Promise<string> {
  const result = await remark()
    .use(gfm)
    .use(html, { sanitize: false })
    .process(markdown);
  
  return result.toString();
}

export function stripHtml(htmlString: string): string {
  return htmlString.replace(/<[^>]*>/g, '');
}
