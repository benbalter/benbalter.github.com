import { remark } from 'remark';
import html from 'remark-html';
import gfm from 'remark-gfm';
import remarkGithub from 'remark-github';
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
    // Sanitization is intentionally disabled because all Markdown content is trusted
    // (authored by the site owner). This allows embedding custom HTML in blog posts and pages.
    .use(html, { sanitize: false })
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
