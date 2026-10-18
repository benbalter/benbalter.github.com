import { describe, it, expect } from 'vitest';
import { markdownAlternatePath } from './markdown-alternate';

describe('markdownAlternatePath', () => {
  it('maps the fixed pages to their .md siblings', () => {
    expect(markdownAlternatePath('/')).toBe('/index.md');
    expect(markdownAlternatePath('/about/')).toBe('/about.md');
    expect(markdownAlternatePath('/resume/')).toBe('/resume.md');
  });

  it('maps a post URL to its .md sibling', () => {
    expect(markdownAlternatePath('/2022/03/17/why-async/')).toBe('/2022/03/17/why-async.md');
  });

  it('returns null for pages without a Markdown version', () => {
    expect(markdownAlternatePath('/posts/')).toBeNull();
    expect(markdownAlternatePath('/contact/')).toBeNull();
    expect(markdownAlternatePath('/resume/print/')).toBeNull();
    expect(markdownAlternatePath('/2022/')).toBeNull();
  });
});
