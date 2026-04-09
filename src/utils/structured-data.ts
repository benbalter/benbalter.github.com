/**
 * Structured Data (JSON-LD) Utilities
 * 
 * Generate Schema.org structured data in JSON-LD format for improved SEO.
 * Uses the open source schema-dts library from Google for type-safe Schema.org types.
 * 
 * @see https://github.com/google/schema-dts
 */

import type { Person, Organization, WebSite, BlogPosting, BreadcrumbList, ListItem, WithContext, Occupation, EducationalOrganization, EducationalOccupationalCredential, ImageObject, ProfilePage, CollectionPage } from 'schema-dts';
import { siteConfig } from '../config';

/** Base Person fields (shared between top-level and embedded schemas) */
function personFields(overrides?: Partial<Person>): Person {
  const person: Person = {
    '@type': 'Person',
    name: siteConfig.author,
    url: siteConfig.url,
    email: siteConfig.email,
    jobTitle: siteConfig.jobTitle,
    worksFor: {
      '@type': 'Organization',
      name: siteConfig.employer,
      url: siteConfig.employerUrl,
    } as Organization,
    sameAs: [
      siteConfig.githubUsername && `https://github.com/${siteConfig.githubUsername}`,
      siteConfig.socialUsername && `https://twitter.com/${siteConfig.socialUsername}`,
      siteConfig.linkedinUrl,
      siteConfig.mastodonUrl,
      siteConfig.blueskyUrl,
    ].filter(Boolean) as string[],
    image: `${siteConfig.url}/assets/img/headshot.jpg`,
  };

  return overrides ? Object.assign({}, person, overrides) as Person : person;
}

/**
 * Generate top-level Person schema (with @context) for standalone use
 */
export function generatePersonSchema(overrides?: Partial<Person>): WithContext<Person> {
  return Object.assign({ '@context': 'https://schema.org' as const, '@id': `${siteConfig.url}/#person` }, personFields(overrides)) as WithContext<Person>;
}

/**
 * Generate embedded Person schema (without @context) for nesting in other schemas
 */
export function generatePersonRef(overrides?: Partial<Person>): Person {
  return personFields(overrides);
}

/**
 * Generate ProfilePage schema for the homepage.
 * Google supports ProfilePage as a rich result type for creator/personal pages.
 * @see https://developers.google.com/search/docs/appearance/structured-data/profile-page
 */
export function generateProfilePageSchema(): WithContext<ProfilePage> {
  return {
    '@context': 'https://schema.org',
    '@type': 'ProfilePage',
    url: siteConfig.url,
    mainEntity: personFields(),
  } as WithContext<ProfilePage>;
}

/**
 * Generate WebSite schema for the blog
 */
export function generateWebSiteSchema(): WithContext<WebSite> {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    '@id': `${siteConfig.url}/#website`,
    name: siteConfig.name,
    url: siteConfig.url,
    author: {
      '@type': 'Person',
      '@id': `${siteConfig.url}/#person`,
      name: siteConfig.author,
      url: siteConfig.url,
    },
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
  wordCount?: number;
}): WithContext<BlogPosting> {
  const { title, description, url, publishedTime, modifiedTime, image, author, wordCount } = props;

  const absoluteImage = image
    ? (image.startsWith('http') ? image : `${siteConfig.url}${image}`)
    : `${siteConfig.url}/assets/img/headshot.jpg`;

  return {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: title,
    description,
    image: absoluteImage,
    datePublished: publishedTime.toISOString(),
    dateModified: modifiedTime?.toISOString() || publishedTime.toISOString(),
    author: {
      '@type': 'Person',
      '@id': `${siteConfig.url}/#person`,
      name: author || siteConfig.author,
    } as Person,
    publisher: {
      '@type': 'Organization',
      '@id': `${siteConfig.url}/#person`,
      name: siteConfig.name,
      url: siteConfig.url,
      logo: {
        '@type': 'ImageObject',
        url: `${siteConfig.url}/assets/img/headshot.jpg`,
      } as ImageObject,
    } as Organization,
    url,
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': url,
    },
    ...(wordCount ? { wordCount } : {}),
    inLanguage: 'en',
  };
}

/**
 * Generate BreadcrumbList schema for navigation.
 *
 * Each breadcrumb item should have a `name` and may optionally have a `url`.
 * If `url` is omitted or an empty string, the item is treated as the current page
 * (i.e., the last breadcrumb item without a link), which is required for Schema.org compliance.
 *
 * @param items - Array of breadcrumb items, each with a `name` and optional `url`.
 * @returns BreadcrumbList schema in JSON-LD format.
 */
export function generateBreadcrumbSchema(items: Array<{ name: string; url?: string }>): WithContext<BreadcrumbList> {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => {
      const element: ListItem = {
        '@type': 'ListItem',
        position: index + 1,
        name: item.name,
      };
      // Only add item URL and @id if it's not empty (last item in breadcrumb)
      if (item.url && item.url !== '') {
        element.item = item.url;
        (element as unknown as Record<string, unknown>)['@id'] = item.url;
      }
      return element;
    }),
  };
}

interface ResumeSchemaProps {
  positions: Array<{
    employer: string;
    title: string;
    startDate: string;
    endDate?: string;
  }>;
  degrees?: Array<{
    school: string;
    degree: string;
    date: string;
  }>;
  certifications?: Array<{
    authority: string;
    name: string;
    url?: string;
  }>;
}

/**
 * Generate Person schema enriched with resume data
 */
export function generateResumeSchema(props: ResumeSchemaProps): WithContext<Person> {
  const { positions, degrees, certifications } = props;

  const currentPosition = positions.find(p => !p.endDate);
  const worksFor: Organization | undefined = currentPosition ? {
    '@type': 'Organization',
    name: currentPosition.employer,
  } : undefined;

  const hasOccupation: Occupation[] = positions.map(position => ({
    '@type': 'Occupation',
    name: position.title,
  }));

  const alumniOf: EducationalOrganization[] | undefined = degrees?.map(degree => ({
    '@type': 'EducationalOrganization',
    name: degree.school,
  }));

  const hasCredential: EducationalOccupationalCredential[] | undefined = certifications?.map(cert => ({
    '@type': 'EducationalOccupationalCredential',
    name: cert.name,
    credentialCategory: 'Professional Certification',
    recognizedBy: {
      '@type': 'Organization',
      name: cert.authority,
    },
    ...(cert.url && { url: cert.url }),
  }));

  return generatePersonSchema({
    worksFor,
    hasOccupation,
    alumniOf,
    hasCredential,
  });
}

/**
 * Convert schema object to JSON-LD script tag content
 * Handles both single schemas and arrays of schemas
 */
export function schemaToJsonLd(
  schema:
    | WithContext<Person | Organization | WebSite | BlogPosting | BreadcrumbList | ProfilePage | CollectionPage>
    | Array<WithContext<Person | Organization | WebSite | BlogPosting | BreadcrumbList | ProfilePage | CollectionPage>>
): string {
  return JSON.stringify(schema, null, 2);
}

/**
 * Wrap multiple schemas in a single @graph envelope for JSON-LD.
 * Strips individual @context from each schema and adds a single top-level @context.
 */
export function schemaToGraphJsonLd(
  schemas: Array<WithContext<Person | Organization | WebSite | BlogPosting | BreadcrumbList | ProfilePage | CollectionPage>>
): string {
  const stripped = schemas.map(s => {
    const { '@context': _, ...rest } = s as unknown as Record<string, unknown>;
    return rest;
  });
  return JSON.stringify({ '@context': 'https://schema.org', '@graph': stripped }, null, 2);
}

/**
 * Generate CollectionPage schema for listing pages (e.g., /posts/)
 */
export function generateCollectionPageSchema(props: {
  name: string;
  description: string;
  url: string;
  posts: Array<{ url: string; title: string }>;
}): WithContext<CollectionPage> {
  return {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: props.name,
    description: props.description,
    url: props.url,
    mainEntity: {
      '@type': 'ItemList',
      itemListElement: props.posts.map((post, index) => ({
        '@type': 'ListItem',
        position: index + 1,
        url: post.url,
        name: post.title,
      })),
    },
  } as WithContext<CollectionPage>;
}
