import { describe, it, expect } from 'vitest';
import { escapeHtml, wrapEmailOff } from './html-escape';

describe('escapeHtml', () => {
  it('should escape ampersands', () => {
    expect(escapeHtml('foo & bar')).toBe('foo &amp; bar');
  });

  it('should escape less than signs', () => {
    expect(escapeHtml('foo < bar')).toBe('foo &lt; bar');
  });

  it('should escape greater than signs', () => {
    expect(escapeHtml('foo > bar')).toBe('foo &gt; bar');
  });

  it('should escape double quotes', () => {
    expect(escapeHtml('foo "bar" baz')).toBe('foo &quot;bar&quot; baz');
  });

  it('should escape single quotes', () => {
    expect(escapeHtml("foo 'bar' baz")).toBe('foo &#039;bar&#039; baz');
  });

  it('should escape all special characters in a string', () => {
    expect(escapeHtml('<script>alert("xss")</script>'))
      .toBe('&lt;script&gt;alert(&quot;xss&quot;)&lt;/script&gt;');
  });

  it('should return empty string for empty input', () => {
    expect(escapeHtml('')).toBe('');
  });

  it('should not modify strings without special characters', () => {
    expect(escapeHtml('mailto:ben@balter.com')).toBe('mailto:ben@balter.com');
  });
});

describe('wrapEmailOff', () => {
  it('should wrap content in email_off comments', () => {
    const html = '<a href="mailto:test@test.com">test@test.com</a>';
    expect(wrapEmailOff(html)).toBe(`<!--email_off-->${html}<!--/email_off-->`);
  });

  it('should handle empty string', () => {
    expect(wrapEmailOff('')).toBe('<!--email_off--><!--/email_off-->');
  });
});
