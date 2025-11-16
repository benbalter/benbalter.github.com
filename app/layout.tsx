import type { Metadata } from 'next';
import Script from 'next/script';
import './globals.css';
import Navigation from './components/Navigation';
import Footer from './components/Footer';
import ClientScripts from './components/ClientScripts';
import { getSiteConfig } from '@/lib/config';
import { getAllPageSlugs, getPageBySlug } from '@/lib/pages';

// Load site configuration from _config.yml
const config = getSiteConfig();

export const metadata: Metadata = {
  metadataBase: new URL(config.url),
  title: {
    default: config.title,
    template: `%s | ${config.title}`,
  },
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
  },
  twitter: {
    card: 'summary',
    creator: `@${config.author.twitter}`,
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
  },
  manifest: '/site.webmanifest',
  alternates: {
    types: {
      'application/rss+xml': `${config.url}/feed.xml`,
    },
  },
};

// Get navigation and footer pages
function getNavPages() {
  return config.nav_pages.map(pagePath => {
    const page = getPageBySlug(pagePath.replace(/\.(md|html)$/, '').replace(/^index$/, ''));
    return {
      title: page?.title || (pagePath === 'index.html' ? 'Posts' : pagePath),
      path: pagePath === 'index.html' ? '/' : `/${pagePath.replace(/\.(md|html)$/, '')}/`,
    };
  });
}

function getFooterPages() {
  return config.footer_pages.map(pagePath => {
    const page = getPageBySlug(pagePath.replace(/\.(md|html)$/, ''));
    return {
      title: page?.title || pagePath,
      path: `/${pagePath.replace(/\.(md|html)$/, '')}/`,
    };
  });
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const navPages = getNavPages();
  const footerPages = getFooterPages();
  
  return (
    <html lang="en-US">
      <head>
        <meta httpEquiv="X-UA-Compatible" content="IE=edge,chrome=1" />
        <meta name="color-scheme" content="light dark" />
        <meta name="theme-color" content="#111111" media="(prefers-color-scheme: light)" />
        <meta name="theme-color" content="#eeeeee" media="(prefers-color-scheme: dark)" />
        {config.social.links.map((link) => (
          <link key={link} rel="me" href={link} />
        ))}
        {/* Load Bootstrap and custom styles from webpack build */}
        <link rel="stylesheet" href="/assets/css/style.css" />
      </head>
      <body className="mt-2">
        <div className="container">
          <Navigation 
            title={config.title} 
            description={config.description}
            navPages={navPages}
          />
          <div className="content" id="content" role="main">
            {children}
          </div>
          <Footer footerPages={footerPages} />
        </div>
        <ClientScripts />
        <Script src="/assets/js/bundle.js" strategy="afterInteractive" />
      </body>
    </html>
  );
}
