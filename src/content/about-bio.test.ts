import { describe, it, expect } from 'vitest';
import { aboutContent, getBioParagraphs, getFirstSentence } from './about-bio';

describe('getFirstSentence', () => {
  it('extracts a single first sentence from bio content', () => {
    const result = getFirstSentence(aboutContent);
    // Assert shape, not copy — the bio's exact wording is editorial and
    // changes. Exact-output behavior is covered by the fixture tests below.
    expect(result.startsWith("I'm Ben Balter")).toBe(true);
    expect(result.endsWith('.')).toBe(true);
    expect(result).not.toContain('\n');
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

describe('getBioParagraphs', () => {
  it('renders Markdown links as anchors', () => {
    const [para] = getBioParagraphs('See [my resume](/resume/) and [GitHub](https://github.com/about).');
    expect(para).toBe('See <a href="/resume/">my resume</a> and <a href="https://github.com/about">GitHub</a>.');
  });

  it('leaves links with unsafe protocols as escaped text', () => {
    const [para] = getBioParagraphs('Click [here](javascript:alert(1)) or [there](//evil.example).');
    expect(para).not.toContain('<a');
    expect(para).toContain('[here](javascript:alert(1))');
  });
});
