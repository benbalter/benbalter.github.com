import { processEmoji, hasEmojiSyntax, getEmoji, searchEmoji } from './emoji';

describe('Emoji Processing', () => {
  describe('processEmoji', () => {
    it('should convert emoji syntax to unicode', () => {
      expect(processEmoji('Hello :wave:')).toBe('Hello 👋');
      expect(processEmoji(':rocket: Launch')).toBe('🚀 Launch');
      expect(processEmoji('I :heart: this')).toBe('I ❤️ this');
    });

    it('should handle multiple emoji', () => {
      expect(processEmoji(':smile: :+1: :rocket:')).toBe('😄 👍 🚀');
    });

    it('should leave unknown emoji unchanged', () => {
      expect(processEmoji(':unknown_emoji:')).toBe(':unknown_emoji:');
    });

    it('should handle text without emoji', () => {
      expect(processEmoji('No emoji here')).toBe('No emoji here');
    });
  });

  describe('hasEmojiSyntax', () => {
    it('should detect emoji syntax', () => {
      expect(hasEmojiSyntax('Hello :wave:')).toBe(true);
      expect(hasEmojiSyntax(':rocket:')).toBe(true);
      expect(hasEmojiSyntax('Text :+1: more text')).toBe(true);
    });

    it('should return false when no emoji syntax present', () => {
      expect(hasEmojiSyntax('No emoji here')).toBe(false);
      expect(hasEmojiSyntax('Just text')).toBe(false);
    });
  });

  describe('getEmoji', () => {
    it('should return emoji for valid names', () => {
      expect(getEmoji('wave')).toBe('👋');
      expect(getEmoji('rocket')).toBe('🚀');
      expect(getEmoji('heart')).toBe('❤️');
    });

    it('should return undefined for invalid names', () => {
      expect(getEmoji('nonexistent_emoji')).toBeUndefined();
    });
  });

  describe('searchEmoji', () => {
    it('should find emoji by keyword', () => {
      const results = searchEmoji('smile');
      expect(Array.isArray(results)).toBe(true);
      expect(results.length).toBeGreaterThan(0);
    });

    it('should return empty array for no matches', () => {
      const results = searchEmoji('xyznonexistent');
      expect(Array.isArray(results)).toBe(true);
    });
  });
});
