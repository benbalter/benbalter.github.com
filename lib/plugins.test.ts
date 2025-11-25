import { describe, it } from 'node:test';
import assert from 'node:assert';
import { processEmoji, hasEmojiSyntax } from './emoji';
import { getGitHubAvatarUrlSync } from './avatar';

describe('Emoji Processing', () => {
  it('should convert emoji syntax to unicode', () => {
    assert.strictEqual(processEmoji('Hello :wave:'), 'Hello 👋');
    assert.strictEqual(processEmoji(':rocket: Launch'), '🚀 Launch');
    assert.strictEqual(processEmoji('I :heart: this'), 'I ❤️ this');
  });

  it('should handle multiple emoji', () => {
    assert.strictEqual(processEmoji(':smile: :+1: :rocket:'), '😄 👍 🚀');
  });

  it('should leave unknown emoji unchanged', () => {
    assert.strictEqual(processEmoji(':unknown_emoji:'), ':unknown_emoji:');
  });

  it('should detect emoji syntax', () => {
    assert.strictEqual(hasEmojiSyntax('Hello :wave:'), true);
    assert.strictEqual(hasEmojiSyntax('No emoji here'), false);
  });
});

describe('GitHub Avatar', () => {
  it('should generate correct avatar URL (sync)', () => {
    assert.strictEqual(getGitHubAvatarUrlSync('benbalter'), 'https://avatars.githubusercontent.com/benbalter?s=40');
    assert.strictEqual(getGitHubAvatarUrlSync('benbalter', 80), 'https://avatars.githubusercontent.com/benbalter?s=80');
  });
});
