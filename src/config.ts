/**
 * Site Configuration
 * 
 * Central configuration file for site metadata, contact information,
 * social links, and other site-wide settings.
 */

export interface ContactLink {
  name: string;
  url: string;
  icon: string;
}

export interface SocialLink {
  name: string;
  url: string;
  icon: string;
}

export interface FooterLink {
  title: string;
  url: string;
}

export const siteConfig = {
  // Basic site information
  name: 'Ben Balter',
  author: 'Ben Balter',
  url: 'https://ben.balter.com',
  description: 'Technology leadership, collaboration, and open source',
  
  // Repository information
  githubRepo: 'benbalter/benbalter.github.com',
  githubRepoUrl: 'https://github.com/benbalter/benbalter.github.com',
  
  // Contact information
  email: 'ben@balter.com',
  
  // Employment information
  jobTitle: 'Director of Hubber Enablement',
  jobDescription: 'Director of Hubber Enablement within the Office of the COO',
  employer: 'GitHub',
  employerUrl: 'https://github.com/about',
  timezone: 'America/New_York',
  
  // Social media handles
  twitterHandle: '@benbalter',
  socialUsername: 'benbalter',
  githubUsername: 'benbalter',
  mastodonHandle: '@benbalter',
  mastodonUrl: 'https://mastodon.social/@benbalter',
  blueskyUrl: 'https://bsky.app/profile/ben.balter.com',
  linkedinUrl: 'https://www.linkedin.com/in/benbalter',
  
  // PGP Key
  pgpKey: '07C6 73FB F30E 01C0 C342 7AB8 DBB6 7C24 6AD3 56C4',
  
  // Default SEO keywords
  keywords: ['Ben Balter', 'GitHub', 'open source', 'technology leadership', 'collaboration'],
  
  // About page metadata
  aboutDescription: 'Ben Balter is an attorney, an open source developer, and a Director of Hubber Enablement at GitHub, the world\'s largest software development network.',
} as const;

// Contact links (used on About and Contact pages)
// icon: Simple icon name for the Icon component (e.g., 'envelope', 'github')
export const contactLinks: ContactLink[] = [
  { name: 'Email', url: `mailto:${siteConfig.email}`, icon: 'envelope' },
  { name: 'Add to contacts', url: '/vcard.vcf', icon: 'address-card' },
  { name: 'Bluesky', url: 'https://bsky.app/profile/ben.balter.com', icon: 'bluesky' },
  { name: 'LinkedIn', url: 'https://www.linkedin.com/in/benbalter', icon: 'linkedin' },
  { name: 'GitHub', url: 'https://github.com/benbalter', icon: 'github' },
];

// Social links for rel=me verification (used in BaseLayout)
// icon: Simple icon name for the Icon component (e.g., 'envelope', 'github')
export const socialLinks: SocialLink[] = [
  { name: 'Twitter', url: 'https://twitter.com/BenBalter', icon: 'twitter' },
  { name: 'LinkedIn', url: 'https://linkedin.com/in/BenBalter', icon: 'linkedin' },
  { name: 'GitHub', url: 'https://github.com/benbalter', icon: 'github' },
  { name: 'Mastodon', url: 'https://mastodon.social/@benbalter', icon: 'mastodon' },
  { name: 'Bluesky', url: 'https://bsky.app/profile/ben.balter.com', icon: 'bluesky' },
];

// Footer navigation links
export const footerLinks: FooterLink[] = [
  { title: 'Other Recommended Reading', url: '/other-recommended-reading/' },
  { title: 'Fine Print', url: '/fine-print/' },
];

// Popular posts - slugs of posts to feature in the "Popular Posts" section
// These are commonly referenced posts based on site analytics and cross-references
export const popularPostSlugs: string[] = [
  '2015-03-17-open-source-best-practices-external-engagement',
  '2014-11-06-rules-of-communicating-at-github',
  '2017-11-10-twelve-tips-for-growing-communities-around-your-open-source-project',
  '2015-11-23-why-open-source',
  '2016-10-31-eight-things-i-wish-i-knew-my-first-week-at-github',
  '2023-01-10-manage-like-an-engineer',
];
