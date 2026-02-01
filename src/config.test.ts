/**
 * Tests for site configuration
 */

import { describe, it, expect } from 'vitest';
import { siteConfig, contactLinks, socialLinks, footerLinks } from './config';

describe('siteConfig', () => {
  it('should have basic site information', () => {
    expect(siteConfig.name).toBe('Ben Balter');
    expect(siteConfig.author).toBe('Ben Balter');
    expect(siteConfig.url).toBe('https://ben.balter.com');
  });

  it('should have a description', () => {
    expect(siteConfig.description).toBeDefined();
    expect(siteConfig.description.length).toBeGreaterThan(0);
  });

  it('should have GitHub repository information', () => {
    expect(siteConfig.githubRepo).toBe('benbalter/benbalter.github.com');
    expect(siteConfig.githubRepoUrl).toBe('https://github.com/benbalter/benbalter.github.com');
  });

  it('should have contact email', () => {
    expect(siteConfig.email).toBe('ben@balter.com');
    expect(siteConfig.email).toMatch(/^[^\s@]+@[^\s@]+\.[^\s@]+$/);
  });

  it('should have social media handles', () => {
    expect(siteConfig.twitterHandle).toBe('@benbalter');
    expect(siteConfig.socialUsername).toBe('benbalter');
  });

  it('should have employment information', () => {
    expect(siteConfig.jobTitle).toBeDefined();
    expect(siteConfig.jobDescription).toBeDefined();
    expect(siteConfig.employer).toBe('GitHub');
    expect(siteConfig.employerUrl).toBeDefined();
    expect(siteConfig.timezone).toBe('America/New_York');
  });

  it('should have social media URLs', () => {
    expect(siteConfig.mastodonUrl).toMatch(/^https:\/\//);
    expect(siteConfig.blueskyUrl).toMatch(/^https:\/\//);
    expect(siteConfig.linkedinUrl).toMatch(/^https:\/\//);
  });

  it('should have about page description', () => {
    expect(siteConfig.aboutDescription).toBeDefined();
    expect(siteConfig.aboutDescription.length).toBeGreaterThan(0);
  });

  it('should have PGP key', () => {
    expect(siteConfig.pgpKey).toBeDefined();
    expect(siteConfig.pgpKey.length).toBeGreaterThan(0);
  });

  it('should have keywords array', () => {
    expect(Array.isArray(siteConfig.keywords)).toBe(true);
    expect(siteConfig.keywords.length).toBeGreaterThan(0);
  });
});

describe('contactLinks', () => {
  it('should be an array', () => {
    expect(Array.isArray(contactLinks)).toBe(true);
  });

  it('should have at least one contact link', () => {
    expect(contactLinks.length).toBeGreaterThan(0);
  });

  it('should have valid contact link structure', () => {
    contactLinks.forEach(link => {
      expect(link).toHaveProperty('name');
      expect(link).toHaveProperty('url');
      expect(link).toHaveProperty('icon');
      expect(typeof link.name).toBe('string');
      expect(typeof link.url).toBe('string');
      expect(typeof link.icon).toBe('string');
    });
  });

  it('should include email contact', () => {
    const emailLink = contactLinks.find(link => link.name === 'Email');
    expect(emailLink).toBeDefined();
    expect(emailLink?.url).toContain('mailto:');
  });

  it('should have FontAwesome icons', () => {
    contactLinks.forEach(link => {
      expect(link.icon).toMatch(/^fa-(solid|brands|regular)\s+fa-/);
    });
  });
});

describe('socialLinks', () => {
  it('should be an array', () => {
    expect(Array.isArray(socialLinks)).toBe(true);
  });

  it('should have multiple social links', () => {
    expect(socialLinks.length).toBeGreaterThan(2);
  });

  it('should have valid social link structure', () => {
    socialLinks.forEach(link => {
      expect(link).toHaveProperty('name');
      expect(link).toHaveProperty('url');
      expect(link).toHaveProperty('icon');
      expect(typeof link.name).toBe('string');
      expect(typeof link.url).toBe('string');
      expect(typeof link.icon).toBe('string');
    });
  });

  it('should include GitHub link', () => {
    const githubLink = socialLinks.find(link => link.name === 'GitHub');
    expect(githubLink).toBeDefined();
    expect(githubLink?.url).toContain('github.com');
  });

  it('should have valid URLs', () => {
    socialLinks.forEach(link => {
      expect(link.url).toMatch(/^https?:\/\//);
    });
  });
});

describe('footerLinks', () => {
  it('should be an array', () => {
    expect(Array.isArray(footerLinks)).toBe(true);
  });

  it('should have at least one footer link', () => {
    expect(footerLinks.length).toBeGreaterThan(0);
  });

  it('should have valid footer link structure', () => {
    footerLinks.forEach(link => {
      expect(link).toHaveProperty('title');
      expect(link).toHaveProperty('url');
      expect(typeof link.title).toBe('string');
      expect(typeof link.url).toBe('string');
    });
  });

  it('should have URLs starting with /', () => {
    footerLinks.forEach(link => {
      expect(link.url).toMatch(/^\//);
    });
  });
});
