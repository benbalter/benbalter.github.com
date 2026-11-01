import { describe, it, expect } from 'vitest';
import { htmlToPlainText, stripHtmlComments, stripHtmlTags } from './strip-html';

describe('stripHtmlTags', () => {
  it('removes simple tags', () => {
    expect(stripHtmlTags('<p>Hello <strong>world</strong></p>')).toBe('Hello world');
  });

  it('uses the replacement string when given', () => {
    expect(stripHtmlTags('one<br>two', ' ')).toBe('one two');
  });

  it('does not let nested fragments reassemble into a tag', () => {
    expect(stripHtmlTags('<scr<script>ipt>alert(1)')).not.toMatch(/<script/i);
  });

  it('leaves text without tags unchanged', () => {
    expect(stripHtmlTags('no tags here')).toBe('no tags here');
  });
});

describe('stripHtmlComments', () => {
  it('removes multiline comments', () => {
    expect(stripHtmlComments('a<!-- x\ny -->b')).toBe('ab');
  });

  it('removes overlapping comment fragments', () => {
    expect(stripHtmlComments('<!--<!---->-->')).not.toContain('<!--');
  });
});

describe('htmlToPlainText', () => {
  it('turns a Mastodon-style note into plain text', () => {
    expect(htmlToPlainText('<p>Open &amp; async. I&#39;m &quot;here&quot; &#x2014; <a href="https://example.com">link</a></p>')).toBe('Open & async. I\'m "here" \u2014 link');
  });

  it('does not let nested fragments reassemble into a tag', () => {
    expect(htmlToPlainText('<scr<script>ipt>alert(1)')).not.toMatch(/<script/i);
  });

  it('decodes each entity once, not twice', () => {
    expect(htmlToPlainText('&amp;lt;b&amp;gt;')).toBe('&lt;b&gt;');
  });

  it('keeps escaped markup as literal text', () => {
    expect(htmlToPlainText('&lt;b&gt;bold&lt;/b&gt;')).toBe('<b>bold</b>');
  });

  it('leaves unknown or out-of-range references alone', () => {
    expect(htmlToPlainText('&bogus; &#x110000;')).toBe('&bogus; &#x110000;');
  });
});
