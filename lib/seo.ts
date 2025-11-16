/**
 * SEO metadata utilities
 * Replaces and enhances jekyll-seo-tag plugin functionality
 */

import { getSiteConfig } from './config';
import { getPostUrlParts, type Post } from './posts';
import type { Page } from './pages';
import type { Metadata } from 'next';

/**
 * Generate comprehensive SEO metadata for a blog post
 */
export function getPostMetadata(post: Post): Metadata {
  const config = getSiteConfig();
  const { url } = getPostUrlParts(post);
  const fullUrl = `${config.url}${url}`;
  const publishDate = new Date(post.date).toISOString();
  
  // Use OG image if specified, otherwise use default
  const ogImage = post.image || post.og_image || `${config.url}/assets/img/headshot.jpg`;
  
  return {
    title: post.title,
    description: post.description || config.description,
    authors: [{ name: config.author.name }],
    openGraph: {
      title: post.title,
      description: post.description || config.description,
      url: fullUrl,
      siteName: config.title,
      locale: 'en_US',
      type: 'article',
      publishedTime: publishDate,
      authors: [config.author.name],
      images: [
        {
          url: ogImage,
          alt: post.title,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: post.title,
      description: post.description || config.description,
      creator: `@${config.author.twitter}`,
      images: [ogImage],
    },
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
  
  return {
    title: page.title || config.title,
    description: page.description || config.description,
    authors: [{ name: config.author.name }],
    openGraph: {
      title: page.title || config.title,
      description: page.description || config.description,
      url: fullUrl,
      siteName: config.title,
      locale: 'en_US',
      type: 'website',
    },
    twitter: {
      card: 'summary',
      title: page.title || config.title,
      description: page.description || config.description,
      creator: `@${config.author.twitter}`,
    },
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
