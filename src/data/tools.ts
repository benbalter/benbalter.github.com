/**
 * Ben's free web tools that posts link to, for their hover cards
 * (src/components/ToolPreviewTemplates.astro → src/scripts/link-previews.ts).
 *
 * Pitches paraphrase each tool's own meta description; update them together.
 */

export interface Tool {
  /** Hostname links are matched on (subdomains match too) */
  host: string;
  name: string;
  /** One line on what it does */
  pitch: string;
}

export const tools: Tool[] = [
  {
    host: 'word2md.com',
    name: 'Word to Markdown',
    pitch: 'Turns Word (.docx) and Google Docs files into clean, GitHub-flavored Markdown.',
  },
  {
    host: 'md2word.app',
    name: 'Markdown to Word',
    pitch: 'Turns Markdown, including ChatGPT and Claude replies, into formatted Word (.docx) files.',
  },
];
