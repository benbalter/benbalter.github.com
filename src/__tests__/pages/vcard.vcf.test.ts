/**
 * Tests for vcard.vcf API endpoint
 *
 * This endpoint generates a vCard 4.0 contact file.
 * It only depends on the vcard4 library and siteConfig (no astro:content).
 */

import { describe, it, expect } from 'vitest';
import { GET, sanitizeFilename } from '../../pages/vcard.vcf';
import { siteConfig } from '../../config';

describe('vcard.vcf', () => {
  describe('sanitizeFilename', () => {
    it('should lowercase the input', () => {
      expect(sanitizeFilename('Ben Balter')).toBe('ben-balter');
    });

    it('should replace whitespace runs with a single hyphen', () => {
      expect(sanitizeFilename('a  b   c')).toBe('a-b-c');
    });

    it('should remove unsafe characters', () => {
      expect(sanitizeFilename('name<script>')).toBe('namescript');
    });

    it('should preserve periods and underscores', () => {
      expect(sanitizeFilename('file_name.ext')).toBe('file_name.ext');
    });

    it('should handle empty string', () => {
      expect(sanitizeFilename('')).toBe('');
    });

    it('should remove characters that could enable header injection', () => {
      expect(sanitizeFilename('name\r\nEvil: header')).toBe('name-evil-header');
    });
  });

  describe('GET', () => {
    // GET ignores its context argument, so pass a minimal stub
    // Cast to Response since the implementation returns synchronously
    const response = GET({} as any) as Response;

    it('should return a 200 response', () => {
      expect(response.status).toBe(200);
    });

    it('should have vcard content type', () => {
      expect(response.headers.get('Content-Type')).toBe('text/vcard; charset=utf-8');
    });

    it('should have Content-Disposition with sanitized filename', () => {
      const disposition = response.headers.get('Content-Disposition');
      expect(disposition).toContain('attachment');
      expect(disposition).toContain('.vcf');
      const expectedFilename = `${sanitizeFilename(siteConfig.author)}.vcf`;
      expect(disposition).toContain(expectedFilename);
    });

    it('should contain BEGIN:VCARD and END:VCARD', async () => {
      const text = await response.clone().text();
      expect(text).toContain('BEGIN:VCARD');
      expect(text).toContain('END:VCARD');
    });

    it('should be vCard version 4.0', async () => {
      const text = await response.clone().text();
      expect(text).toContain('VERSION:4.0');
    });

    it('should contain the formatted name', async () => {
      const text = await response.clone().text();
      expect(text).toContain(`FN:${siteConfig.author}`);
    });

    it('should contain the email', async () => {
      const text = await response.clone().text();
      expect(text).toContain(`EMAIL:${siteConfig.email}`);
    });

    it('should contain the organization', async () => {
      const text = await response.clone().text();
      expect(text).toContain(`ORG:${siteConfig.employer}`);
    });

    it('should contain the job title', async () => {
      const text = await response.clone().text();
      expect(text).toContain(`TITLE:${siteConfig.jobTitle}`);
    });

    it('should contain the site URL', async () => {
      const text = await response.clone().text();
      expect(text).toContain(`URL:${siteConfig.url}`);
    });

    it('should contain the timezone', async () => {
      const text = await response.clone().text();
      expect(text).toContain(`TZ:${siteConfig.timezone}`);
    });

    it('should contain a PGP key reference', async () => {
      const text = await response.clone().text();
      expect(text).toContain('KEY');
      expect(text).toContain('key.asc');
    });

    it('should contain the nickname', async () => {
      const text = await response.clone().text();
      expect(text).toContain(`NICKNAME:@${siteConfig.socialUsername}`);
    });

    it('should contain a photo URL', async () => {
      const text = await response.clone().text();
      expect(text).toContain('PHOTO');
      expect(text).toContain('headshot.jpg');
    });

    it('should contain a SOURCE referencing vcard.vcf', async () => {
      const text = await response.clone().text();
      expect(text).toContain('SOURCE');
      expect(text).toContain('vcard.vcf');
    });
  });
});
