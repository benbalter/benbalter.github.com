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

export const aboutContent = `Ben Balter is the Director of Hubber Enablement within the Office of the COO at [GitHub](https://github.com/about), the world's largest software development platform, ensuring all Hubbers can do their best (remote) work. Previously, he served as the Director of Technical Business Operations, and as Chief of Staff for Security, he managed the office of the Chief Security Officer, improving overall business effectiveness of the Security organization through portfolio management, strategy, planning, culture, and values. As a Staff Technical Program manager for Enterprise and Compliance, Ben managed GitHub's on-premises and SaaS enterprise offerings, and as the Senior Product Manager overseeing the platform's Trust and Safety efforts, Ben shipped more than 500 features in support of community management, privacy, compliance, content moderation, product security, platform health, and open source workflows to ensure the GitHub community and platform remained safe, secure, and welcoming for all software developers. Before joining GitHub's Product team, Ben served as GitHub's Government Evangelist, leading the efforts to encourage more than 2,000 government organizations across 75 countries to adopt open source philosophies for code, data, and policy development.

Described by the US Chief Technology Officer as one of "the baddest of the badass innovators," prior to GitHub, Ben was a member of the inaugural class of Presidential Innovation Fellows where he served as entrepreneur in residence reimagining the role of technology in brokering the relationship between citizens and government. Ben has also served as a Fellow in the Office of the US Chief Information Officer within the Executive Office of the President where he was instrumental in drafting President Obama's Digital Strategy and Open Data Policy, and on the SoftWare Automation and Technology (SWAT) Team, the White House's first agile development team. His paper, [Towards a More Agile Government](/2011/11/29/towards-a-more-agile-government/) was published in the Public Contract Law Journal, arguing that Federal IT Procurement should be more amenable to modern, agile development methods.

As an attorney passionate about the disruptive potential of technology, Ben holds a J.D. and an M.B.A. from the George Washington University and is a member of the DC Bar. When not trying to change the world, he enjoys tackling otherwise-impossible challenges to sharing information using nothing more than duct tape, version control, and occasionally a pack of bubblegum. [Full resume](/resume/).`;

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
