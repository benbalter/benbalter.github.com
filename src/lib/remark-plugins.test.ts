/**
 * Test remark plugins for emoji and mentions
 */

import { describe, it, expect } from 'vitest';
import { unified } from 'unified';
import remarkParse from 'remark-parse';
import remarkEmoji from 'remark-emoji';
import remarkStringify from 'remark-stringify';
import { remarkMentions } from './remark-mentions';

describe('Remark Plugins', () => {
  describe('remarkEmoji', () => {
    it('converts emoji shortcodes to emoji', async () => {
      const processor = unified()
        .use(remarkParse)
        .use(remarkEmoji)
        .use(remarkStringify);

      const result = await processor.process('Hello :wave: world :rocket:');
      const output = String(result);

      // Check that emoji are converted (exact output may vary by plugin version)
      expect(output).toContain('👋');
      expect(output).toContain('🚀');
    });

    it('leaves text without emoji unchanged', async () => {
      const processor = unified()
        .use(remarkParse)
        .use(remarkEmoji)
        .use(remarkStringify);

      const result = await processor.process('Hello world');
      expect(String(result)).toContain('Hello world');
    });

    it('handles multiple emoji in one line', async () => {
      const processor = unified()
        .use(remarkParse)
        .use(remarkEmoji)
        .use(remarkStringify);

      const result = await processor.process(':+1: :tada: :sparkles:');
      const output = String(result);

      expect(output).toContain('👍');
      expect(output).toContain('🎉');
      expect(output).toContain('✨');
    });
  });

  describe('remarkMentions', () => {
    it('converts @mentions to GitHub profile links', async () => {
      const processor = unified()
        .use(remarkParse)
        .use(remarkMentions)
        .use(remarkStringify);

      const result = await processor.process('Thanks @benbalter for the help!');
      const output = String(result);

      // Should contain a link to the GitHub profile
      expect(output).toContain('[@benbalter](https://github.com/benbalter)');
    });

    it('handles multiple mentions', async () => {
      const processor = unified()
        .use(remarkParse)
        .use(remarkMentions)
        .use(remarkStringify);

      const result = await processor.process('Thanks @benbalter and @github!');
      const output = String(result);

      expect(output).toContain('[@benbalter](https://github.com/benbalter)');
      expect(output).toContain('[@github](https://github.com/github)');
    });

    it('handles mentions with hyphens', async () => {
      const processor = unified()
        .use(remarkParse)
        .use(remarkMentions)
        .use(remarkStringify);

      const result = await processor.process('Shoutout to @some-user-name');
      const output = String(result);

      expect(output).toContain('[@some-user-name](https://github.com/some-user-name)');
    });

    it('leaves text without mentions unchanged', async () => {
      const processor = unified()
        .use(remarkParse)
        .use(remarkMentions)
        .use(remarkStringify);

      const result = await processor.process('Hello world no mentions here');
      const output = String(result);

      expect(output).toContain('Hello world');
      expect(output).not.toContain('github.com');
    });

    it('does not link email addresses', async () => {
      const processor = unified()
        .use(remarkParse)
        .use(remarkMentions)
        .use(remarkStringify);

      const result = await processor.process('Email: test@example.com');
      const output = String(result);

      // Should not convert email @ to GitHub link
      expect(output).not.toContain('github.com/example.com');
    });

    it('handles mentions in various contexts', async () => {
      const processor = unified()
        .use(remarkParse)
        .use(remarkMentions)
        .use(remarkStringify);

      const text = `
Start of paragraph @user1 in the middle.

- List item with @user2
- Another item

End with @user3.
`;

      const result = await processor.process(text);
      const output = String(result);

      expect(output).toContain('[@user1](https://github.com/user1)');
      expect(output).toContain('[@user2](https://github.com/user2)');
      expect(output).toContain('[@user3](https://github.com/user3)');
    });
  });

  describe('Combined plugins', () => {
    it('works with both emoji and mentions together', async () => {
      const processor = unified()
        .use(remarkParse)
        .use(remarkEmoji)
        .use(remarkMentions)
        .use(remarkStringify);

      const result = await processor.process('Great work @benbalter :tada:');
      const output = String(result);

      expect(output).toContain('[@benbalter](https://github.com/benbalter)');
      expect(output).toContain('🎉');
    });
  });
});
