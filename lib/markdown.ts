import { remark } from 'remark';
import html from 'remark-html';
import remarkGfm from 'remark-gfm';

export async function markdownToHtml(markdown: string): Promise<string> {
  const result = await remark()
    .use(remarkGfm)
    // Note: sanitize: false is safe here as content comes from trusted repository markdown files
    .use(html, { sanitize: false })
    .process(markdown);
  return result.toString();
}
