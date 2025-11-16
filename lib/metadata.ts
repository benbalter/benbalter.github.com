import type { Metadata } from 'next';
import { getSiteConfig } from './config';

/**
 * Shared metadata configuration for the site.
 * Provides default metadata values that can be overridden by individual pages.
 * 
 * @see https://nextjs.org/docs/app/building-your-application/optimizing/metadata
 */
export function getSharedMetadata(): Metadata {
  const config = getSiteConfig();
  
  return {
    metadataBase: new URL(config.url),
    title: {
      default: config.title,
      template: `%s | ${config.title}`,
    },
    description: config.description,
    authors: [{ name: config.author.name, url: config.url }],
    creator: config.author.name,
    publisher: config.author.name,
    keywords: [
      'Ben Balter',
      'GitHub',
      'open source',
      'technology leadership',
      'collaboration',
      'software development',
    ],
    openGraph: {
      type: 'website',
      locale: 'en_US',
      url: config.url,
      siteName: config.title,
      title: config.title,
      description: config.description,
    },
    twitter: {
      card: 'summary',
      creator: config.author.twitter,
      title: config.title,
      description: config.description,
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
    icons: {
      icon: [
        { url: '/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
        { url: '/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
      ],
      apple: '/apple-touch-icon.png',
      shortcut: '/favicon.ico',
      other: [
        {
          rel: 'mask-icon',
          url: '/safari-pinned-tab.svg',
        },
      ],
    },
    manifest: '/site.webmanifest',
    alternates: {
      types: {
        'application/rss+xml': `${config.url}/feed.xml`,
      },
    },
  };
}

/**
 * Generate metadata for a blog post.
 * Includes Open Graph images, structured data, and other SEO enhancements.
 */
export function getPostMetadata(post: {
  title: string;
  description?: string;
  date: string;
  image?: string;
  slug: string;
}): Metadata {
  const config = getSiteConfig();
  const [year, month, day, ...rest] = post.slug.split('-');
  const slug = rest.join('-');
  const url = `${config.url}/${year}/${month}/${day}/${slug}/`;
  
  // Default OG image path
  const ogImage = post.image || `/assets/images/og/${post.slug}.png`;
  
  return {
    title: post.title,
    description: post.description,
    openGraph: {
      type: 'article',
      url,
      title: post.title,
      description: post.description,
      publishedTime: post.date,
      authors: [config.author.name],
      images: [
        {
          url: ogImage,
          width: 1200,
          height: 630,
          alt: post.title,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: post.title,
      description: post.description,
      creator: config.author.twitter,
      images: [ogImage],
    },
  };
}

/**
 * Generate metadata for a page.
 */
export function getPageMetadata(page: {
  title?: string;
  description?: string;
  slug: string;
}): Metadata {
  const config = getSiteConfig();
  const url = `${config.url}/${page.slug}/`;
  
  return {
    title: page.title,
    description: page.description,
    openGraph: {
      url,
      title: page.title || config.title,
      description: page.description || config.description,
    },
  };
}
