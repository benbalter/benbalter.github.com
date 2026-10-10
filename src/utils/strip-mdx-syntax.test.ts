import { describe, it, expect } from 'vitest';
import { stripMdxSyntax } from './strip-mdx-syntax';

describe('stripMdxSyntax', () => {
  it('removes a single-line import and the blank line it leaves', () => {
    const body = `import BookCta from '../../components/BookCta.astro';\n\nMy book has a linter.`;
    expect(stripMdxSyntax(body)).toBe('My book has a linter.');
  });

  it('removes side-effect and multiple imports', () => {
    const body = `import './styles.css';\nimport Foo from './Foo.astro';\n\nHello.`;
    expect(stripMdxSyntax(body)).toBe('Hello.');
  });

  it('removes export statements', () => {
    const body = `export const meta = { a: 1 };\n\nBody text.`;
    expect(stripMdxSyntax(body)).toBe('Body text.');
  });

  it('removes a multi-line import without leaking its middle lines', () => {
    const body = `import {\n  BookCta,\n} from '../../components/BookCta.astro';\n\nContent.`;
    expect(stripMdxSyntax(body)).toBe('Content.');
  });

  it('removes a standalone JSX component tag', () => {
    const body = `Some words.\n\n<BookCta variant="featured" />\n\nMore words.`;
    expect(stripMdxSyntax(body)).toBe('Some words.\n\n\nMore words.');
  });

  it('turns a standalone YouTube embed into a link instead of dropping it', () => {
    expect(stripMdxSyntax('Intro\n\n<YouTube id="abc123" title="My talk" />\n\nOutro')).toBe(
      'Intro\n\n[Watch "My talk" on YouTube](https://www.youtube.com/watch?v=abc123)\n\nOutro',
    );
    expect(stripMdxSyntax('<YouTube id="abc123" />')).toBe('[Watch on YouTube](https://www.youtube.com/watch?v=abc123)');
  });

  it('preserves import/export shown inside a fenced code block', () => {
    const body =
      '```js\nimport React from \'react\';\nexport default App;\n```\n\nProse.';
    expect(stripMdxSyntax(body)).toBe(
      '```js\nimport React from \'react\';\nexport default App;\n```\n\nProse.'
    );
  });

  it('keeps a longer fence open across a shorter nested fence', () => {
    const body = '````md\n```js\nimport Foo from \'./Foo\';\n```\n<Foo />\n````\n\nProse.';
    expect(stripMdxSyntax(body)).toBe(body);
  });

  it('keeps prose lines that merely start with "import"', () => {
    const body = 'import tariffs rose sharply that year.\n\nMore prose.';
    expect(stripMdxSyntax(body)).toBe(body);
  });

  it('still removes namespace and default-plus-named imports', () => {
    const body = "import * as utils from './utils';\nimport A, { b } from './a';\n\nHello.";
    expect(stripMdxSyntax(body).trim()).toBe('Hello.');
  });

  it('preserves a JSX tag shown inside a tilde-fenced code block', () => {
    const body = '~~~\n<BookCta />\n~~~\n\nProse.';
    expect(stripMdxSyntax(body)).toBe('~~~\n<BookCta />\n~~~\n\nProse.');
  });

  it('leaves lowercase HTML elements untouched', () => {
    const body = `<figure>\n  <img src="a.png" alt="a" />\n</figure>`;
    expect(stripMdxSyntax(body)).toBe(body);
  });

  it('does not treat prose beginning with "Import"/"Export" as ESM', () => {
    const body = `Import duties are high.\n\nExport controls matter.`;
    expect(stripMdxSyntax(body)).toBe(body);
  });

  it('handles empty and non-string input', () => {
    expect(stripMdxSyntax('')).toBe('');
    // @ts-expect-error exercising defensive guard
    expect(stripMdxSyntax(undefined)).toBe('');
  });

  it('unwraps :quote directives to their text', () => {
    const body = 'GitHub is like :quote[Dropbox, but for code]{#like-dropbox}. Really.';
    expect(stripMdxSyntax(body)).toBe('GitHub is like Dropbox, but for code. Really.');
  });

  it('drops inline self-closing components inside a line', () => {
    const body = '- [Why URLs](/2015/11/12/why-urls/): context, opt-in. <InBook />';
    expect(stripMdxSyntax(body)).toBe('- [Why URLs](/2015/11/12/why-urls/): context, opt-in.');
  });

  it('leaves components and directives shown in inline code alone', () => {
    const body = 'Use `<InBook />` or `:quote[text]{#id}` in a post.';
    expect(stripMdxSyntax(body)).toBe(body);
  });
});
