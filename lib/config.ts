import fs from 'fs';
import path from 'path';
import yaml from 'js-yaml';

export interface ContactLink {
  name: string;
  url: string;
  icon: string;
}

export interface SiteConfig {
  title: string;
  description: string;
  url: string;
  keywords?: string[];
  author: {
    name: string;
    twitter: string;
  };
  social: {
    name: string;
    links: string[];
  };
  nav_pages: string[];
  footer_pages: string[];
  contact_links: ContactLink[];
  pgp_key?: string;
  job_title: string;
  employer: {
    name: string;
    url: string;
  };
  repository: string;
  branch: string;
  handle: string;
  email?: string;
  amazon?: {
    affiliates_tag: string;
  };
  og_image?: {
    domain?: string;
    image?: string;
    border_bottom?: {
      width?: number;
      fill?: string[];
    };
  };
}

let cachedConfig: SiteConfig | null = null;

/**
 * Load site configuration from _config.yml
 * This serves as the single source of truth for site metadata
 */
export function getSiteConfig(): SiteConfig {
  if (cachedConfig) {
    return cachedConfig;
  }

  const configPath = path.join(process.cwd(), '_config.yml');
  const fileContents = fs.readFileSync(configPath, 'utf8');
  const config = yaml.load(fileContents) as SiteConfig;
  
  cachedConfig = config;
  return config;
}

/**
 * Get navigation pages configuration
 */
export function getNavPages(): string[] {
  const config = getSiteConfig();
  return config.nav_pages || [];
}

/**
 * Get footer pages configuration
 */
export function getFooterPages(): string[] {
  const config = getSiteConfig();
  return config.footer_pages || [];
}

/**
 * Get the first paragraph of the about page bio
 * Reads the about.md file and extracts the first paragraph after front matter
 */
export function getAuthorBio(): string {
  const aboutPath = path.join(process.cwd(), 'about.md');
  const fileContents = fs.readFileSync(aboutPath, 'utf8');
  
  // Remove front matter (everything between --- markers)
  const withoutFrontMatter = fileContents.replace(/^---[\s\S]*?---\n/, '');
  
  // Get first paragraph (text until first double newline)
  const firstParagraph = withoutFrontMatter.trim().split('\n\n')[0];
  
  return firstParagraph || '';
}

/**
 * Get Amazon affiliates tag from configuration
 */
export function getAmazonAffiliatesTag(): string {
  const config = getSiteConfig();
  return config.amazon?.affiliates_tag || 'benbalter07-20';
}

/**
 * Get contact links from configuration
 */
export function getContactLinks(): ContactLink[] {
  const config = getSiteConfig();
  return config.contact_links || [];
}

/**
 * Get PGP key from configuration
 */
export function getPgpKey(): string | undefined {
  const config = getSiteConfig();
  return config.pgp_key;
}
