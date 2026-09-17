/**
 * Shared LinkedIn formatting utilities.
 *
 * Used by:
 * - src/pages/resume/linkedin.astro (renders LinkedIn-ready resume data)
 * - src/pages/resume/linkedin-limits.test.ts (enforces LinkedIn field limits)
 */

import { stripMarkdown } from './strip-markdown';
import { stripHtmlComments } from './strip-html';

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
  const paragraphPlaceholder = '[[PARA]]';
  let cleaned = text
    // Match list markers at any indent so nested sub-bullets flatten to `• `
    // too (LinkedIn's description field has no nested-list affordance).
    .replace(/^[ \t]*[-*]\s+/gm, bulletPlaceholder)
    .replace(/^#+\s+/gm, '');
  cleaned = stripHtmlComments(cleaned);

  // Protect blank lines the same way bullets are protected. `stripMarkdown`
  // ends with `\s+ -> ' '`, which flattens every newline, so a paragraph break
  // that isn't stashed here is gone by the time we could restore it. Single
  // newlines are markdown soft wraps and SHOULD collapse to a space; only a
  // blank line is a real paragraph break.
  cleaned = cleaned.replace(/\n[ \t]*\n\s*/g, paragraphPlaceholder);

  cleaned = stripMarkdown(cleaned);

  cleaned = cleaned
    // A paragraph break immediately before a bullet is one break, not two.
    .replace(/\[\[PARA\]\]\s*\[\[BULLET\]\]/g, '<br><br>• ')
    .replace(/\[\[BULLET\]\]/g, '<br>• ')
    .replace(/\[\[PARA\]\]/g, '<br><br>')
    // stripMarkdown turns the newline before a placeholder into a space, which
    // would paste as a trailing space at the end of every line.
    .replace(/[ \t]+<br>/g, '<br>')
    .replace(/^(?:<br>)+/, '')
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
