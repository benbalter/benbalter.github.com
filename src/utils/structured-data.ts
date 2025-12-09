/**
 * Structured Data (JSON-LD) Utilities
 * 
 * Generate Schema.org structured data in JSON-LD format for improved SEO.
 * Supports various schema types for different content types.
 */

import { siteConfig } from '../config';

/**
 * Base schema properties that all schemas share
 */
interface BaseSchema {
  '@context': string;
  '@type': string;
}

/**
 * Person schema for author/profile information
 */
export interface PersonSchema extends BaseSchema {
  '@type': 'Person';
  name: string;
  url: string;
  email?: string;
  jobTitle?: string;
  sameAs?: string[];
  image?: string;
}

/**
 * Organization schema for company/org information
 */
export interface OrganizationSchema extends BaseSchema {
  '@type': 'Organization';
  name: string;
  url: string;
  logo?: string;
  sameAs?: string[];
}

/**
 * WebSite schema for the website itself
 */
export interface WebSiteSchema extends BaseSchema {
  '@type': 'WebSite';
  name: string;
  url: string;
  author: PersonSchema;
  description?: string;
}

/**
 * BlogPosting schema for blog articles
 */
export interface BlogPostingSchema extends BaseSchema {
  '@type': 'BlogPosting';
  headline: string;
  description?: string;
  image?: string;
  datePublished: string;
  dateModified?: string;
  author: PersonSchema;
  publisher?: OrganizationSchema | PersonSchema;
  url: string;
  mainEntityOfPage: {
    '@type': 'WebPage';
    '@id': string;
  };
}

/**
 * BreadcrumbList schema for navigation context
 */
export interface BreadcrumbListSchema extends BaseSchema {
  '@type': 'BreadcrumbList';
  itemListElement: Array<{
    '@type': 'ListItem';
    position: number;
    name: string;
    item?: string;
  }>;
}

/**
 * Generate Person schema for Ben Balter
 */
export function generatePersonSchema(overrides?: Partial<PersonSchema>): PersonSchema {
  return {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: siteConfig.author,
    url: siteConfig.url,
    email: siteConfig.email,
    jobTitle: 'Senior Technical Program Manager at GitHub',
    sameAs: [
      `https://github.com/${siteConfig.githubUsername}`,
      `https://twitter.com/${siteConfig.socialUsername}`,
      `https://www.linkedin.com/in/${siteConfig.socialUsername}`,
      'https://mastodon.social/@benbalter',
      'https://bsky.app/profile/ben.balter.com',
    ],
    image: `${siteConfig.url}/assets/img/headshot.jpg`,
    ...overrides,
  };
}

/**
 * Generate Organization schema for GitHub
 */
export function generateOrganizationSchema(): OrganizationSchema {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'GitHub',
    url: 'https://github.com',
    logo: 'https://github.githubassets.com/images/modules/logos_page/GitHub-Mark.png',
    sameAs: [
      'https://twitter.com/github',
      'https://www.linkedin.com/company/github',
      'https://www.facebook.com/GitHub',
    ],
  };
}

/**
 * Generate WebSite schema for the blog
 */
export function generateWebSiteSchema(): WebSiteSchema {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: siteConfig.name,
    url: siteConfig.url,
    author: generatePersonSchema(),
    description: siteConfig.description,
  };
}

/**
 * Generate BlogPosting schema for blog posts
 */
export function generateBlogPostingSchema(props: {
  title: string;
  description?: string;
  url: string;
  publishedTime: Date;
  modifiedTime?: Date;
  image?: string;
  author?: string;
}): BlogPostingSchema {
  const { title, description, url, publishedTime, modifiedTime, image, author } = props;

  return {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: title,
    description,
    image: image || `${siteConfig.url}/assets/img/headshot.jpg`,
    datePublished: publishedTime.toISOString(),
    dateModified: modifiedTime?.toISOString() || publishedTime.toISOString(),
    author: generatePersonSchema({ name: author || siteConfig.author }),
    publisher: generatePersonSchema(),
    url,
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': url,
    },
  };
}

/**
 * Generate BreadcrumbList schema for navigation
 */
export function generateBreadcrumbSchema(items: Array<{ name: string; url?: string }>): BreadcrumbListSchema {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => {
      const element: any = {
        '@type': 'ListItem',
        position: index + 1,
        name: item.name,
      };
      // Only add item URL if it's not empty (last item in breadcrumb)
      if (item.url && item.url !== '') {
        element.item = item.url;
      }
      return element;
    }),
  };
}

/**
 * Convert schema object to JSON-LD script tag content
 */
export function schemaToJsonLd(schema: BaseSchema | BaseSchema[]): string {
  return JSON.stringify(schema, null, 2);
}
