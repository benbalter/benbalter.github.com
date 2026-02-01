import { describe, it, expect } from 'vitest';
import { isInternalUrl } from './is-internal-url';

describe('isInternalUrl', () => {
  const siteUrl = 'https://ben.balter.com';

  describe('relative URLs', () => {
    it('should treat paths starting with / as internal', () => {
      expect(isInternalUrl('/about/', siteUrl)).toBe(true);
      expect(isInternalUrl('/contact/', siteUrl)).toBe(true);
      expect(isInternalUrl('/2024/01/01/post/', siteUrl)).toBe(true);
    });

    it('should treat root path as internal', () => {
      expect(isInternalUrl('/', siteUrl)).toBe(true);
    });

    it('should not treat protocol-relative URLs as simple relative URLs', () => {
      expect(isInternalUrl('//example.com/path', siteUrl)).toBe(false);
    });
  });

  describe('absolute URLs with same origin', () => {
    it('should treat absolute URLs with same origin as internal', () => {
      expect(isInternalUrl('https://ben.balter.com/about/', siteUrl)).toBe(true);
      expect(isInternalUrl('https://ben.balter.com/contact/', siteUrl)).toBe(true);
      expect(isInternalUrl('https://ben.balter.com/', siteUrl)).toBe(true);
    });

    it('should handle URLs with trailing slashes', () => {
      expect(isInternalUrl('https://ben.balter.com/about/', siteUrl)).toBe(true);
      expect(isInternalUrl('https://ben.balter.com/about', siteUrl)).toBe(true);
    });

    it('should handle URLs with query parameters', () => {
      expect(isInternalUrl('https://ben.balter.com/search/?q=test', siteUrl)).toBe(true);
    });

    it('should handle URLs with hash fragments', () => {
      expect(isInternalUrl('https://ben.balter.com/about/#bio', siteUrl)).toBe(true);
    });
  });

  describe('absolute URLs with different origin', () => {
    it('should treat URLs from different domains as external', () => {
      expect(isInternalUrl('https://github.com/benbalter', siteUrl)).toBe(false);
      expect(isInternalUrl('https://example.com/', siteUrl)).toBe(false);
    });

    it('should treat URLs from subdomains as external', () => {
      expect(isInternalUrl('https://blog.ben.balter.com/', siteUrl)).toBe(false);
      expect(isInternalUrl('https://www.ben.balter.com/', siteUrl)).toBe(false);
    });

    it('should treat URLs with different protocols as external', () => {
      expect(isInternalUrl('http://ben.balter.com/', siteUrl)).toBe(false);
    });
  });

  describe('non-http protocols', () => {
    it('should treat mailto links as external', () => {
      expect(isInternalUrl('mailto:ben@balter.com', siteUrl)).toBe(false);
    });

    it('should treat tel links as external', () => {
      expect(isInternalUrl('tel:+1234567890', siteUrl)).toBe(false);
    });

    it('should treat javascript links as external', () => {
      expect(isInternalUrl('javascript:void(0)', siteUrl)).toBe(false);
    });
  });

  describe('edge cases', () => {
    it('should handle empty strings', () => {
      expect(isInternalUrl('', siteUrl)).toBe(false);
    });

    it('should handle whitespace', () => {
      expect(isInternalUrl('  ', siteUrl)).toBe(false);
    });

    it('should handle null/undefined-like values', () => {
      expect(isInternalUrl(null as any, siteUrl)).toBe(false);
      expect(isInternalUrl(undefined as any, siteUrl)).toBe(false);
    });

    it('should handle invalid URLs', () => {
      expect(isInternalUrl('not a url', siteUrl)).toBe(false);
      expect(isInternalUrl('htp://broken.com', siteUrl)).toBe(false);
    });
  });
});
