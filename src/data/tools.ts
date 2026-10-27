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
  /** What it does, within PITCH_MAX so the card's two-line clamp never cuts it */
  pitch: string;
}

/** Characters that fit the hover card's two description lines at 320px */
export const PITCH_MAX = 90;

export const tools: Tool[] = [
  {
    host: 'word2md.com',
    name: 'Word to Markdown',
    pitch: 'Converts Word and Google Docs files into clean, GitHub-flavored Markdown.',
  },
  {
    host: 'md2word.app',
    name: 'Markdown to Word',
    pitch: 'Converts Markdown, including ChatGPT and Claude replies, into Word files.',
  },
];
