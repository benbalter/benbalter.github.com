import { describe, it, expect } from 'vitest';
import { absolutizeMarkdownLinks } from './absolutize-markdown-links';

const origin = 'https://ben.balter.com';

describe('absolutizeMarkdownLinks', () => {
  it('prefixes root-relative inline links and images', () => {
    expect(absolutizeMarkdownLinks('See [this](/2014/01/01/a/) and ![x](/assets/a.png).', origin)).toBe(
      'See [this](https://ben.balter.com/2014/01/01/a/) and ![x](https://ben.balter.com/assets/a.png).',
    );
  });

  it('prefixes root-relative reference definitions', () => {
    expect(absolutizeMarkdownLinks('[a]: /about/', origin)).toBe('[a]: https://ben.balter.com/about/');
  });

  it('leaves absolute, protocol-relative, and fragment links alone', () => {
    const body = '[a](https://x.com/) [b](//cdn.example.com/x) [c](#top) [d](relative/)';
    expect(absolutizeMarkdownLinks(body, origin)).toBe(body);
  });

  it('leaves fenced code blocks untouched, including nested shorter fences', () => {
    const body = ['````md', '```', '[a](/x/)', '```', '````', '[b](/y/)'].join('\n');
    expect(absolutizeMarkdownLinks(body, origin).split('\n')).toEqual([
      '````md', '```', '[a](/x/)', '```', '````', '[b](https://ben.balter.com/y/)',
    ]);
  });
});
