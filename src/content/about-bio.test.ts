import { describe, it, expect } from 'vitest';
import { aboutContent, getFirstSentence } from './about-bio';

describe('getFirstSentence', () => {
  it('extracts first sentence from bio content', () => {
    const result = getFirstSentence(aboutContent);
    expect(result).toBe(
      "I'm Ben Balter — I write here about engineering leadership, open source, and showing your work."
    );
  });

  it('strips markdown links from content', () => {
    const result = getFirstSentence(aboutContent);
    // Should not contain markdown link syntax
    expect(result).not.toContain('[GitHub]');
    expect(result).not.toContain('](https://github.com/about)');
  });

  it('returns reasonable length for meta description', () => {
    const result = getFirstSentence(aboutContent);
    // SEO best practice: under 200 characters is acceptable
    expect(result.length).toBeLessThanOrEqual(200);
    // First 150 characters should contain key information
    const first150 = result.substring(0, 150);
    expect(first150).toContain('Ben Balter');
    expect(first150).toContain('engineering leadership');
  });

  it('handles content with markdown links', () => {
    const testContent = 'This is a sentence with [a link](https://example.com). This is another sentence.';
    const result = getFirstSentence(testContent);
    expect(result).toBe('This is a sentence with a link.');
    expect(result).not.toContain('[a link]');
  });

  it('handles single sentence without trailing space', () => {
    const testContent = 'This is a single sentence.';
    const result = getFirstSentence(testContent);
    expect(result).toBe('This is a single sentence.');
  });
});
