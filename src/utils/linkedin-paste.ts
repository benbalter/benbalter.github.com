/**
 * LinkedIn's profile editors collapse empty lines on paste, so paragraph
 * breaks in a copied About or description come out as single line breaks.
 * A blank line holding U+2800 (Braille Pattern Blank) isn't empty to LinkedIn,
 * so it survives, and it renders as nothing. LinkedIn strips ordinary and
 * non-breaking spaces, so those don't work.
 *
 * Kept free of other imports: the copy script ships it to the browser.
 */
export const LINKEDIN_BLANK_LINE = '⠀';

/** Text exactly as the copy button puts it on the clipboard for LinkedIn. */
export function toLinkedinPasteText(text: string): string {
  return text.replace(/\r\n?/g, '\n').replace(/^[ \t]*$/gm, LINKEDIN_BLANK_LINE);
}
