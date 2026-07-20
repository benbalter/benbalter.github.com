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
  description: 'Engineering leadership, open source, and showing your work',
  
  // Repository information
  githubRepo: 'benbalter/benbalter.github.com',
  githubRepoUrl: 'https://github.com/benbalter/benbalter.github.com',
  
  // Contact information
  email: 'ben@balter.com',
  
  // Employment information.
  // Currently between full-time roles, so the site asserts no current employer
  // (no worksFor in the Person schema). GitHub is the most recent/notable
  // employer, presented as a former affiliation ("Formerly … at GitHub").
  formerJobTitle: 'Director of Hubber Enablement',
  formerEmployer: 'GitHub',
  formerEmployerUrl: 'https://github.com/about',
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
  
  // Kit (ConvertKit) form ID for inline email subscribe form.
  // Leave empty to hide email row in SubscribeCta.
  // Find this in your Kit dashboard under Forms → form embed code.
  kitFormId: '9381290',

  // Book — pre-launch until bookLaunch. The sitewide BookCta stays in teaser
  // mode ("Coming …", get-notified) until then; only the gated launch post's
  // BookLaunchCta uses bookPrice/bookPricePaperback. On launch day, flip BookCta
  // to buy-now to match the marketing site.
  bookUrl: 'https://open-and-async.com/?utm_source=benbalter-book-cta',
  bookTitle: 'Open & Async',
  bookDescription: 'The collaborative software development playbook for remote and distributed teams',
  bookLaunch: 'July 21, 2026',
  bookPrice: '$9.99',
  bookPricePaperback: '$29.99',

  // About page metadata
  aboutDescription: 'Ben Balter is a writer, open source developer, and attorney whose open source projects have hundreds of millions of downloads. Formerly Director of Hubber Enablement at GitHub.',

  // standard.site (https://standard.site/) — AT Protocol long-form publishing.
  // The publication and each post become records in the author's own PDS, and
  // the site links back to them so indexers can verify ownership.
  standardSite: {
    // AT Protocol DID for ben.balter.com (resolved from the Bluesky handle).
    did: 'did:plc:dw6j5wx7vyzjxxoauzdbim6w',
    // AT-URI of the site.standard.publication record. Empty until the record is
    // created via script/standard-site/create-publication.ts — when empty, the
    // /.well-known endpoint 404s and the publication link tag is omitted.
    publicationUri: 'at://did:plc:dw6j5wx7vyzjxxoauzdbim6w/site.standard.publication/3mn5pbyuiq52t',
    // Only posts published on/after this date get a site.standard.document record
    // and link tag. Set before the earliest post (2010-09-12) so the full
    // backfilled corpus is covered.
    since: '2010-01-01',
  },
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
  { title: 'Open & Async', url: 'https://open-and-async.com/?utm_source=benbalter-footer' },
  { title: 'No Agenda, No Meeting', url: 'https://noagendanomeeting.net/' },
  { title: 'Other Recommended Reading', url: '/other-recommended-reading/' },
  { title: 'Subscribe', url: '/subscribe/' },
  { title: 'Fine Print', url: '/fine-print/' },
];

// Popular posts - slugs of posts to feature in the "Popular Posts" section.
// Curated from Cloudflare RUM data (see analytics-report.md): the
// career/management cluster leads by a wide margin, rounded out with a few
// evergreen classics. Revisit as new RUM data comes in.
export const popularPostSlugs: string[] = [
  '2026-06-07-reorgs-happen',
  '2026-04-27-one-on-one-playbook',
  '2026-04-27-the-brag-doc',
  '2023-03-02-github-for-non-technical-roles',
  '2014-11-06-rules-of-communicating-at-github',
  '2023-01-10-manage-like-an-engineer',
  '2022-02-16-leaders-show-their-work',
  '2022-03-17-why-async',
  '2015-11-12-why-urls',
];
