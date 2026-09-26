import { describe, it, expect } from 'vitest';
import { stripHtmlComments, stripHtmlTags } from './strip-html';

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
