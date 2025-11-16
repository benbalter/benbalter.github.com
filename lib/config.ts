import fs from 'fs';
import path from 'path';
import yaml from 'js-yaml';

interface SiteConfig {
  title: string;
  description: string;
  url: string;
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
  job_title: string;
  employer: {
    name: string;
    url: string;
  };
  repository: string;
  branch: string;
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
