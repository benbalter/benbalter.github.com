/**
 * Structured Data (JSON-LD) Utilities
 * 
 * Generate Schema.org structured data in JSON-LD format for improved SEO.
 * Uses the open source schema-dts library from Google for type-safe Schema.org types.
 * 
 * @see https://github.com/google/schema-dts
 */

import type { Person, Organization, WebSite, BlogPosting, BreadcrumbList, WithContext } from 'schema-dts';
import { siteConfig } from '../config';

/**
 * Generate Person schema for Ben Balter
 */
export function generatePersonSchema(overrides?: Partial<Person>): WithContext<Person> {
  const person: WithContext<Person> = {
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
  };
  
  // Apply overrides if provided
  if (overrides) {
    return Object.assign({}, person, overrides) as WithContext<Person>;
  }
  
  return person;
}

/**
 * Generate Organization schema for GitHub
 */
export function generateOrganizationSchema(): WithContext<Organization> {
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
export function generateWebSiteSchema(): WithContext<WebSite> {
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
}): WithContext<BlogPosting> {
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
export function generateBreadcrumbSchema(items: Array<{ name: string; url?: string }>): WithContext<BreadcrumbList> {
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
 * Handles both single schemas and arrays of schemas
 */
export function schemaToJsonLd(schema: WithContext<any> | WithContext<any>[]): string {
  return JSON.stringify(schema, null, 2);
}
