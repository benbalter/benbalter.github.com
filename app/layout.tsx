import type { Metadata } from 'next';
import Script from 'next/script';
import './globals.css';
import Navigation from './components/Navigation';
import Footer from './components/Footer';
import ClientScripts from './components/ClientScripts';

export const metadata: Metadata = {
  title: {
    default: 'Ben Balter',
    template: '%s | Ben Balter',
  },
  description: 'Technology leadership, collaboration, and open source',
  metadataBase: new URL('https://ben.balter.com'),
  authors: [{ name: 'Ben Balter', url: 'https://ben.balter.com' }],
  openGraph: {
    title: 'Ben Balter',
    description: 'Technology leadership, collaboration, and open source',
    url: 'https://ben.balter.com',
    siteName: 'Ben Balter',
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary',
    title: 'Ben Balter',
    description: 'Technology leadership, collaboration, and open source',
    creator: '@benbalter',
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
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta httpEquiv="X-UA-Compatible" content="IE=edge,chrome=1" />
        <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no" />
        <meta name="color-scheme" content="light dark" />
        <meta name="theme-color" content="#111111" media="(prefers-color-scheme: light)" />
        <meta name="theme-color" content="#eeeeee" media="(prefers-color-scheme: dark)" />
        <link rel="me" href="https://twitter.com/BenBalter" />
        <link rel="me" href="https://linkedin.com/in/BenBalter" />
        <link rel="me" href="https://github.com/benbalter" />
        <link rel="me" href="https://facebook.com/ben.balter" />
        <link rel="me" href="https://instagram.com/benbalter" />
        <link rel="me" href="https://threads.net/@benbalter" />
        <link rel="me" href="https://mastodon.social/@benbalter" />
        <link rel="me" href="https://bsky.app/profile/ben.balter.com" />
        {/* Load Bootstrap and custom styles from webpack build */}
        <link rel="stylesheet" href="/assets/css/style.css" />
      </head>
      <body className="mt-2">
        <div className="container">
          <Navigation />
          <div className="content" id="content" role="main">
            {children}
          </div>
          <Footer />
        </div>
        <ClientScripts />
        <Script src="/assets/js/bundle.js" strategy="afterInteractive" />
      </body>
    </html>
  );
}
