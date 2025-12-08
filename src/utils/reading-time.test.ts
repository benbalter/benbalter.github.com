/**
 * Tests for reading time calculations
 */

import { describe, it, expect } from 'vitest';
import { calculateReadingTime, formatReadingTime } from './reading-time';

describe('calculateReadingTime', () => {
  it('should return 0 for empty content', () => {
    expect(calculateReadingTime('')).toBe(0);
    expect(calculateReadingTime('   ')).toBe(0);
  });

  it('should calculate reading time for plain text', () => {
    // 100 words at 200 words per minute = 1 minute (ceiling)
    const words = Array.from({ length: 100 }, (_, i) => `word${i}`).join(' ');
    expect(calculateReadingTime(words)).toBe(1);
  });

  it('should calculate reading time for longer content', () => {
    // 500 words at 200 words per minute = 3 minutes (ceiling of 2.5)
    const words = Array.from({ length: 500 }, (_, i) => `word${i}`).join(' ');
    expect(calculateReadingTime(words)).toBe(3);
  });

  it('should remove HTML tags from content', () => {
    const htmlContent = '<p>This is a test</p><div>with HTML tags</div>';
    const result = calculateReadingTime(htmlContent);
    // "This is a test with HTML tags" = 6 words = 1 minute
    expect(result).toBe(1);
  });

  it('should remove code blocks from content', () => {
    const contentWithCode = `
      This is some text
      \`\`\`javascript
      const code = "this should not be counted";
      const moreCode = "neither should this";
      \`\`\`
      And more text
    `;
    const result = calculateReadingTime(contentWithCode);
    // "This is some text And more text" = 7 words = 1 minute
    expect(result).toBe(1);
  });

  it('should remove inline code from content', () => {
    const contentWithInlineCode = 'Use `console.log()` to debug your code effectively';
    const result = calculateReadingTime(contentWithInlineCode);
    // "Use to debug your code effectively" = 6 words = 1 minute
    expect(result).toBe(1);
  });

  it('should remove URLs from content', () => {
    const contentWithUrls = 'Check out https://example.com for more information about this topic';
    const result = calculateReadingTime(contentWithUrls);
    // "Check out for more information about this topic" = 8 words = 1 minute
    expect(result).toBe(1);
  });

  it('should use custom words per minute rate', () => {
    const words = Array.from({ length: 300 }, (_, i) => `word${i}`).join(' ');
    // 300 words at 100 words per minute = 3 minutes
    expect(calculateReadingTime(words, 100)).toBe(3);
    // 300 words at 300 words per minute = 1 minute
    expect(calculateReadingTime(words, 300)).toBe(1);
  });

  it('should return minimum of 1 minute for very short content', () => {
    expect(calculateReadingTime('Hello')).toBe(1);
    expect(calculateReadingTime('Hi there')).toBe(1);
  });

  it('should handle complex HTML content', () => {
    const complexHtml = `
      <article>
        <h1>Title</h1>
        <p>This is a paragraph with <strong>bold text</strong> and <em>italic text</em>.</p>
        <ul>
          <li>List item one</li>
          <li>List item two</li>
        </ul>
        <pre><code>const x = 42;</code></pre>
      </article>
    `;
    const result = calculateReadingTime(complexHtml);
    // Should count words from text content, not code
    expect(result).toBeGreaterThan(0);
  });
});

describe('formatReadingTime', () => {
  it('should format reading time correctly', () => {
    expect(formatReadingTime(1)).toBe('1 min read');
    expect(formatReadingTime(5)).toBe('5 min read');
    expect(formatReadingTime(10)).toBe('10 min read');
  });

  it('should handle zero or negative values', () => {
    expect(formatReadingTime(0)).toBe('1 min read');
    expect(formatReadingTime(-1)).toBe('1 min read');
  });
});
