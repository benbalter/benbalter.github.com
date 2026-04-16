/**
 * Shared LinkedIn formatting utilities.
 *
 * Used by:
 * - src/pages/resume/linkedin.astro (renders LinkedIn-ready resume data)
 * - src/pages/resume/linkedin-limits.test.ts (enforces LinkedIn field limits)
 */

import { stripMarkdown } from './strip-markdown';

/**
 * LinkedIn profile field character limits (as of 2025).
 * Source: LinkedIn Help Center character limits documentation.
 */
export const LINKEDIN_LIMITS = {
  headline: 220,
  about: 2600,
  description: 2000,
  skill: 80,
} as const;

/**
 * Clean up a markdown description for LinkedIn by stripping markdown and
 * replacing list markers with ASCII bullets so the copied plain text renders
 * cleanly in LinkedIn's description field.
 *
 * Returns HTML using `<br>` for line breaks; the live page reads `.innerText`
 * on copy which turns `<br>` into newlines.
 */
export function cleanDescription(text: string): string {
  if (!text) return '';

  const bulletPlaceholder = '[[BULLET]]';
  let cleaned = text
    .replace(/^[-*]\s+/gm, bulletPlaceholder)
    .replace(/^#+\s+/gm, '')
    .replace(/<!--.*?-->/g, '');

  cleaned = stripMarkdown(cleaned);

  cleaned = cleaned
    .replace(/\[\[BULLET\]\]/g, '<br>• ')
    .replace(/^<br>/, '')
    .replace(/\s+$/, '');

  return cleaned;
}

/**
 * Length of a description as LinkedIn will count it (after `<br>` → `\n`
 * conversion, matching what `element.innerText` yields on copy).
 */
export function linkedinCharCount(htmlOrText: string): number {
  return htmlOrText.replace(/<br\s*\/?>/gi, '\n').length;
}
