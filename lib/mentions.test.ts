import { processMentions, processMentionsInHtml, extractMentions, hasMentions } from './mentions';

describe('Mentions Processing', () => {
  describe('processMentions', () => {
    it('should convert @username to GitHub links', () => {
      const result = processMentions('Thanks @benbalter');
      expect(result).toContain('href="https://github.com/benbalter"');
      expect(result).toContain('@benbalter');
    });

    it('should handle multiple mentions', () => {
      const result = processMentions('Thanks @alice and @bob');
      expect(result).toContain('github.com/alice');
      expect(result).toContain('github.com/bob');
    });

    it('should not convert email addresses', () => {
      expect(processMentions('Email: test@example.com')).toBe('Email: test@example.com');
    });

    it('should handle usernames with hyphens', () => {
      const result = processMentions('Thanks @user-name-123');
      expect(result).toContain('github.com/user-name-123');
    });

    it('should not match partial username patterns', () => {
      // @ at the end of a URL path
      expect(processMentions('url/path@user')).toBe('url/path@user');
    });
  });

  describe('processMentionsInHtml', () => {
    it('should process mentions in HTML text nodes', () => {
      const html = '<p>Thanks @benbalter for the help</p>';
      const result = processMentionsInHtml(html);
      expect(result).toContain('href="https://github.com/benbalter"');
    });

    it('should not modify HTML tags', () => {
      const html = '<a href="test">@benbalter</a>';
      const result = processMentionsInHtml(html);
      expect(result).toContain('href="test"');
      expect(result).toContain('github.com/benbalter');
    });
  });

  describe('extractMentions', () => {
    it('should extract mentions from text', () => {
      expect(extractMentions('Thanks @alice and @bob')).toEqual(['alice', 'bob']);
    });

    it('should return empty array when no mentions', () => {
      expect(extractMentions('No mentions here')).toEqual([]);
    });

    it('should extract single mention', () => {
      expect(extractMentions('Hello @benbalter')).toEqual(['benbalter']);
    });
  });

  describe('hasMentions', () => {
    it('should detect mentions', () => {
      expect(hasMentions('Thanks @alice')).toBe(true);
      expect(hasMentions('@bob helped')).toBe(true);
    });

    it('should return false when no mentions', () => {
      expect(hasMentions('No mentions here')).toBe(false);
      expect(hasMentions('Email: test@example.com')).toBe(false);
    });
  });
});
