import { describe, it } from 'node:test';
import assert from 'node:assert';
import { processEmoji, hasEmojiSyntax } from './emoji';
import { processMentions, extractMentions, hasMentions } from './mentions';
import { getGitHubAvatarUrl } from './avatar';

describe('Emoji Processing', () => {
  it('should convert emoji syntax to unicode', () => {
    assert.strictEqual(processEmoji('Hello :wave:'), 'Hello 👋');
    assert.strictEqual(processEmoji(':rocket: Launch'), '🚀 Launch');
    assert.strictEqual(processEmoji('I :heart: this'), 'I ❤️ this');
  });

  it('should handle multiple emoji', () => {
    assert.strictEqual(processEmoji(':smile: :thumbsup: :rocket:'), '😄 👍 🚀');
  });

  it('should leave unknown emoji unchanged', () => {
    assert.strictEqual(processEmoji(':unknown_emoji:'), ':unknown_emoji:');
  });

  it('should detect emoji syntax', () => {
    assert.strictEqual(hasEmojiSyntax('Hello :wave:'), true);
    assert.strictEqual(hasEmojiSyntax('No emoji here'), false);
  });
});

describe('Mentions Processing', () => {
  it('should convert @username to GitHub links', () => {
    const result = processMentions('Thanks @benbalter');
    assert.ok(result.includes('href="https://github.com/benbalter"'));
    assert.ok(result.includes('@benbalter'));
  });

  it('should handle multiple mentions', () => {
    const result = processMentions('Thanks @alice and @bob');
    assert.ok(result.includes('github.com/alice'));
    assert.ok(result.includes('github.com/bob'));
  });

  it('should not convert email addresses', () => {
    assert.strictEqual(processMentions('Email: test@example.com'), 'Email: test@example.com');
  });

  it('should extract mentions', () => {
    assert.deepStrictEqual(extractMentions('Thanks @alice and @bob'), ['alice', 'bob']);
  });

  it('should detect mentions', () => {
    assert.strictEqual(hasMentions('Thanks @alice'), true);
    assert.strictEqual(hasMentions('No mentions here'), false);
  });
});

describe('GitHub Avatar', () => {
  it('should generate correct avatar URL', () => {
    assert.strictEqual(getGitHubAvatarUrl('benbalter'), 'https://avatars.githubusercontent.com/benbalter?s=40');
    assert.strictEqual(getGitHubAvatarUrl('benbalter', 80), 'https://avatars.githubusercontent.com/benbalter?s=80');
  });
});
