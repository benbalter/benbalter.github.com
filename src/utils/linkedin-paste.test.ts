import { describe, it, expect } from 'vitest';
import { toLinkedinPasteText, LINKEDIN_BLANK_LINE } from './linkedin-paste';
import { linkedinCharCount } from './linkedin-format';

describe('toLinkedinPasteText', () => {
  it('fills blank lines so LinkedIn keeps paragraph breaks', () => {
    expect(toLinkedinPasteText('One.\n\nTwo.')).toBe(`One.\n${LINKEDIN_BLANK_LINE}\nTwo.`);
  });

  it('treats whitespace-only lines and CRLF as blank', () => {
    expect(toLinkedinPasteText('One.\r\n  \r\nTwo.')).toBe(`One.\n${LINKEDIN_BLANK_LINE}\nTwo.`);
  });

  it('leaves single line breaks alone', () => {
    expect(toLinkedinPasteText('One.\nTwo.')).toBe('One.\nTwo.');
  });

  it('is counted by linkedinCharCount', () => {
    expect(linkedinCharCount('One.<br><br>Two.')).toBe('One.\n⠀\nTwo.'.length);
  });
});
