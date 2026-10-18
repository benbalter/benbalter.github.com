import { describe, it, expect } from 'vitest';
import { directivesToBlockquotes } from './directives-to-blockquotes';

describe('directivesToBlockquotes', () => {
  it('turns a labeled directive into a blockquote with a bold label', () => {
    const input = ':::info[Edit — Feb 2014]\nSome text.\n:::';
    expect(directivesToBlockquotes(input)).toBe('> **Edit — Feb 2014:** Some text.');
  });

  it('falls back to the directive name when there is no label', () => {
    expect(directivesToBlockquotes(':::warning\nCareful.\n:::')).toBe('> **Warning:** Careful.');
  });

  it('keeps multi-paragraph bodies inside the blockquote', () => {
    const input = ':::objection[But what about X?]\nFirst.\n\nSecond.\n:::';
    expect(directivesToBlockquotes(input)).toBe('> **But what about X?** First.\n>\n> Second.');
  });

  it('leaves surrounding prose alone', () => {
    const input = 'Before.\n\n:::note\nA note.\n:::\n\nAfter.';
    expect(directivesToBlockquotes(input)).toBe('Before.\n\n> **Note:** A note.\n\nAfter.');
  });

  it('ignores ::: inside fenced code blocks', () => {
    const input = '```markdown\n:::note\nexample\n:::\n```';
    expect(directivesToBlockquotes(input)).toBe(input);
  });

  it('ignores the {attrs} block on the opening fence', () => {
    expect(directivesToBlockquotes(':::info[Heads up]{#tip}\nText.\n:::')).toBe('> **Heads up:** Text.');
  });

  it('puts the label on its own line before a list', () => {
    expect(directivesToBlockquotes(':::info[Steps]\n- one\n- two\n:::')).toBe('> **Steps:**\n>\n> - one\n> - two');
  });

  it('keeps a code block inside a directive quoted', () => {
    const input = ':::note\n```sh\nls\n```\n:::';
    expect(directivesToBlockquotes(input)).toBe('> **Note:**\n>\n> ```sh\n> ls\n> ```');
  });
});
