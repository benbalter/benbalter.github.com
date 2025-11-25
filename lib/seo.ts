/**
 * SEO metadata utilities
 * Replaces and enhances jekyll-seo-tag plugin functionality
 */

import { getSiteConfig } from './config';
import { getPostUrlParts, type Post } from './posts';
import { getPostOgImage, getPageOgImage, getDefaultOgImage } from './og-image';
import type { Page } from './pages';
import type { Metadata } from 'next';

// Standard OG image dimensions for social sharing
const OG_IMAGE_WIDTH = 1200;
const OG_IMAGE_HEIGHT = 630;

/**
 * Get the full absolute URL for a given path
 */
function getFullUrl(path: string): string {
  const config = getSiteConfig();
  return `${config.url}${path}`;
}

/**
 * Get the full absolute URL for a blog post
 */
function getFullPostUrl(post: Post): string {
  const { url } = getPostUrlParts(post);
  return getFullUrl(url);
}

/**
 * Build common Open Graph metadata structure
 */
function buildOpenGraphMetadata(
  title: string,
  description: string,
  url: string,
  imageUrl: string,
  imageAlt: string,
  type: 'article' | 'website' = 'website',
  publishedTime?: string,
  authors?: string[]
): NonNullable<Metadata['openGraph']> {
  const config = getSiteConfig();
  
  const openGraph: NonNullable<Metadata['openGraph']> = {
    title,
    description,
    url,
    siteName: config.title,
    locale: 'en_US',
    type,
    images: [
      {
        url: imageUrl,
        alt: imageAlt,
        width: OG_IMAGE_WIDTH,
        height: OG_IMAGE_HEIGHT,
      },
    ],
    ...(publishedTime && { publishedTime }),
    ...(authors && { authors }),
  };
  
  return openGraph;
}

/**
 * Build common Twitter Card metadata structure
 */
function buildTwitterMetadata(
  title: string,
  description: string,
  imageUrl: string,
  cardType: 'summary' | 'summary_large_image' = 'summary'
): NonNullable<Metadata['twitter']> {
  const config = getSiteConfig();
  
  return {
    card: cardType,
    title,
    description,
    creator: `@${config.author.twitter}`,
    images: [imageUrl],
  };
}

/**
 * Generate comprehensive SEO metadata for a blog post
 */
export function getPostMetadata(post: Post): Metadata {
  const config = getSiteConfig();
  const fullUrl = getFullPostUrl(post);
  const publishDate = new Date(post.date).toISOString();
  const description = post.description || config.description;
  
  // Get OG image using the helper
  const ogImage = getPostOgImage(post);
  
  return {
    title: post.title,
    description,
    authors: [{ name: config.author.name }],
    openGraph: buildOpenGraphMetadata(
      post.title,
      description,
      fullUrl,
      ogImage,
      post.title,
      'article',
      publishDate,
      [config.author.name]
    ),
    twitter: buildTwitterMetadata(post.title, description, ogImage, 'summary_large_image'),
    alternates: {
      canonical: fullUrl,
    },
  };
}

/**
 * Generate SEO metadata for a page
 */
export function getPageMetadata(page: Page, path: string): Metadata {
  const config = getSiteConfig();
  const fullUrl = getFullUrl(path);
  const ogImage = getPageOgImage(page.image);
  const title = page.title || config.title;
  const description = page.description || config.description;
  
  return {
    title,
    description,
    authors: [{ name: config.author.name }],
    openGraph: buildOpenGraphMetadata(title, description, fullUrl, ogImage, title),
    twitter: buildTwitterMetadata(title, description, ogImage),
    alternates: {
      canonical: fullUrl,
    },
  };
}

/**
 * Generate JSON-LD structured data for a blog post
 */
export function getPostJsonLd(post: Post): object {
  const config = getSiteConfig();
  const fullUrl = getFullPostUrl(post);
  
  return {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.title,
    description: post.description || config.description,
    image: post.image || `${config.url}/assets/img/headshot.jpg`,
    datePublished: new Date(post.date).toISOString(),
    dateModified: new Date(post.date).toISOString(),
    author: {
      '@type': 'Person',
      name: config.author.name,
      url: config.url,
    },
    publisher: {
      '@type': 'Person',
      name: config.author.name,
      url: config.url,
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': fullUrl,
    },
  };
}

/**
 * Generate JSON-LD structured data for the site/person
 */
export function getPersonJsonLd(): object {
  const config = getSiteConfig();
  
  return {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: config.author.name,
    url: config.url,
    sameAs: config.social.links,
    jobTitle: config.job_title,
    worksFor: {
      '@type': 'Organization',
      name: config.employer.name,
      url: config.employer.url,
    },
  };
}

/**
 * Generate JSON-LD structured data for a website
 */
export function getWebsiteJsonLd(): object {
  const config = getSiteConfig();
  
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: config.title,
    description: config.description,
    url: config.url,
    author: {
      '@type': 'Person',
      name: config.author.name,
    },
  };
}

/**
 * Generate JSON-LD BreadcrumbList for a blog post
 * Provides navigation context for search engines
 */
export function getPostBreadcrumbJsonLd(post: Post): object {
  const config = getSiteConfig();
  const fullUrl = getFullPostUrl(post);
  
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Home',
        item: config.url,
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: post.title,
        item: fullUrl,
      },
    ],
  };
}

/**
 * Generate JSON-LD BreadcrumbList for a page
 * Provides navigation context for search engines
 */
export function getPageBreadcrumbJsonLd(page: Page, path: string): object {
  const config = getSiteConfig();
  const fullUrl = getFullUrl(path);
  const title = page.title || 'Page';
  
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Home',
        item: config.url,
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: title,
        item: fullUrl,
      },
    ],
  };
}

/**
 * Generate JSON-LD structured data for a WebPage
 * Used for non-blog pages like About, Contact, Resume, etc.
 */
export function getWebPageJsonLd(page: Page, path: string): object {
  const config = getSiteConfig();
  const fullUrl = getFullUrl(path);
  const title = page.title || config.title;
  const description = page.description || config.description;
  
  return {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    name: title,
    description,
    url: fullUrl,
    author: {
      '@type': 'Person',
      name: config.author.name,
      url: config.url,
    },
    isPartOf: {
      '@type': 'WebSite',
      name: config.title,
      url: config.url,
    },
  };
}

/**
 * Generate SEO metadata for the home page
 * Includes WebSite schema and enhanced OG metadata
 */
export function getHomePageMetadata(): Metadata {
  const config = getSiteConfig();
  const ogImage = getDefaultOgImage();
  
  return {
    title: config.title,
    description: config.description,
    keywords: config.keywords,
    authors: [{ name: config.author.name, url: config.url }],
    creator: config.author.name,
    publisher: config.author.name,
    openGraph: {
      type: 'website',
      locale: 'en_US',
      url: config.url,
      siteName: config.title,
      title: config.title,
      description: config.description,
      images: [
        {
          url: ogImage,
          alt: config.title,
          width: OG_IMAGE_WIDTH,
          height: OG_IMAGE_HEIGHT,
        },
      ],
    },
    twitter: {
      card: 'summary',
      creator: `@${config.author.twitter}`,
      title: config.title,
      description: config.description,
      images: [ogImage],
    },
    alternates: {
      canonical: config.url,
      types: {
        'application/rss+xml': `${config.url}/feed.xml`,
      },
    },
  };
}
