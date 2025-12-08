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
  
  // Social media handles
  twitterHandle: '@benbalter',
  socialUsername: 'benbalter',
  
  // PGP Key
  pgpKey: '07C6 73FB F30E 01C0 C342 7AB8 DBB6 7C24 6AD3 56C4',
  
  // Default SEO keywords
  keywords: ['Ben Balter', 'GitHub', 'open source', 'technology leadership', 'collaboration'],
} as const;

// Contact links (used on About and Contact pages)
export const contactLinks: ContactLink[] = [
  { name: 'Email', url: `mailto:${siteConfig.email}`, icon: 'fa-solid fa-envelope' },
  { name: 'Add to contacts', url: '/vcard.vcf', icon: 'fa-solid fa-address-card' },
  { name: 'Bluesky', url: 'https://bsky.app/profile/ben.balter.com', icon: 'fa-brands fa-bluesky' },
  { name: 'LinkedIn', url: 'https://www.linkedin.com/in/benbalter', icon: 'fa-brands fa-linkedin' },
  { name: 'GitHub', url: 'https://github.com/benbalter', icon: 'fa-brands fa-github' },
];

// Social links for rel=me verification (used in BaseLayout)
export const socialLinks: SocialLink[] = [
  { name: 'Twitter', url: 'https://twitter.com/BenBalter', icon: 'fab fa-twitter' },
  { name: 'LinkedIn', url: 'https://linkedin.com/in/BenBalter', icon: 'fab fa-linkedin' },
  { name: 'GitHub', url: 'https://github.com/benbalter', icon: 'fab fa-github' },
  { name: 'Mastodon', url: 'https://mastodon.social/@benbalter', icon: 'fab fa-mastodon' },
  { name: 'Bluesky', url: 'https://bsky.app/profile/ben.balter.com', icon: 'fas fa-cloud' },
];

// Footer navigation links
export const footerLinks: FooterLink[] = [
  { title: 'Other Recommended Reading', url: '/other-recommended-reading/' },
  { title: 'Fine Print', url: '/fine-print/' },
];
