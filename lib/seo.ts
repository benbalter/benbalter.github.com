/**
 * SEO metadata utilities
 * Replaces and enhances jekyll-seo-tag plugin functionality
 */

import { getSiteConfig } from './config';
import { getPostUrlParts, type Post } from './posts';
import { getPostOgImage, getPageOgImage } from './og-image';
import type { Page } from './pages';
import type { Metadata } from 'next';

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
  const { url } = getPostUrlParts(post);
  const fullUrl = `${config.url}${url}`;
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
  const fullUrl = `${config.url}${path}`;
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
  const { url } = getPostUrlParts(post);
  const fullUrl = `${config.url}${url}`;
  
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
