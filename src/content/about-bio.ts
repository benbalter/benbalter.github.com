/**
 * About page bio content
 * 
 * This is the source of truth for the author bio, used in:
 * - The about page (src/pages/about.astro)
 * - The mini-bio component (src/components/MiniBio.astro)
 * 
 * The first paragraph is automatically extracted for the mini-bio.
 */

import { escapeHtml } from '../utils/html-escape';

export const aboutContent = `I'm Ben Balter — I write here about engineering leadership, open source, and showing your work. I was the Director of Hubber Enablement at [GitHub](https://github.com/about), where I helped thousands of GitHubbers do their best remote work. Before this role: Chief of Staff for Security, enterprise PM, and GitHub's first Government Evangelist. Before GitHub: attorney, Presidential Innovation Fellow, and member of the White House's first agile development team.

The US CTO once called me one of "the baddest of the badass innovators" — the single nicest thing anyone's ever put in print about me. I helped draft parts of President Obama's Digital Strategy and Open Data Policy, and argued in the Public Contract Law Journal that [federal IT procurement should look more like modern software development](/2011/11/29/towards-a-more-agile-government/). Mostly, I've spent the last decade trying to figure out how large engineering organizations actually work — and why the obvious answers are usually wrong.

I hold a J.D. and M.B.A. from the George Washington University and am a member of the DC Bar. When I'm not trying to change the world, I enjoy tackling otherwise-impossible challenges to sharing information using nothing more than duct tape, version control, and occasionally a pack of bubblegum. [Full resume](/resume/).`;

/**
 * Validate URL to only allow safe protocols
 */
function isValidUrl(url: string): boolean {
  const trimmed = url.trim();
  
  // Allow http(s) absolute URLs
  if (trimmed.startsWith('http://') || trimmed.startsWith('https://')) {
    try {
      const parsed = new URL(trimmed);
      return parsed.protocol === 'http:' || parsed.protocol === 'https:';
    } catch {
      return false;
    }
  }
  
  // Allow root-relative paths but not protocol-relative URLs
  return trimmed.startsWith('/') && !trimmed.startsWith('//');
}

/**
 * Simple markdown link converter: [text](url) => <a href="url">text</a>
 * Only allows http(s) and relative URLs for security, escapes HTML
 */
function convertMarkdownLinks(text: string): string {
  return text.replace(/\[([^\]]+)\]\(([^)]+)\)/g, (match, linkText, url) => {
    // Validate URL for security
    if (isValidUrl(url)) {
      return `<a href="${escapeHtml(url)}">${escapeHtml(linkText)}</a>`;
    }
    // Return original text if URL is not valid
    return match;
  });
}

/**
 * Get the first paragraph of the bio for use in mini-bio component
 */
export function getFirstParagraph(content: string): string {
  // Split by double newlines (paragraph breaks)
  const paragraphs = content.split('\n\n').filter(p => p.trim().length > 0);
  const firstPara = paragraphs[0] || '';
  // Convert markdown links to HTML
  return convertMarkdownLinks(firstPara);
}

/**
 * Get bio as array of paragraphs for rendering (with markdown links converted)
 */
export function getBioParagraphs(content: string): string[] {
  return content.split('\n\n')
    .filter(p => p.trim().length > 0)
    .map(p => convertMarkdownLinks(p));
}

/**
 * Strip markdown links from text, keeping only the link text
 * [text](url) => text
 */
function stripMarkdownLinks(text: string): string {
  return text.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '$1');
}

/**
 * Get the first sentence of the bio (stripped of markdown) for use as meta description
 * Handles markdown links properly by stripping them before finding the sentence boundary
 */
export function getFirstSentence(content: string): string {
  // Get first paragraph and strip markdown links first
  const firstPara = content.split('\n\n')[0] || '';
  const stripped = stripMarkdownLinks(firstPara);
  
  // Find the first sentence (ending with period followed by space or end)
  const match = stripped.match(/^[^.]+\.\s/);
  if (match) {
    return match[0].trim();
  }
  
  // If no clear sentence boundary, look for period at end
  const endMatch = stripped.match(/^[^.]+\.$/);
  if (endMatch) {
    return endMatch[0];
  }
  
  // Fallback to first paragraph
  return stripped;
}
