import type { Metadata } from 'next';
import Script from 'next/script';
import Nav from './components/Nav';
import Footer from './components/Footer';

export const metadata: Metadata = {
  title: 'Ben Balter',
  description: 'Technology leadership, collaboration, and open source',
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
        
        {/* Favicons */}
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
        <link rel="manifest" href="/site.webmanifest" />
        <link rel="shortcut icon" href="/favicon.ico" />
        <meta name="msapplication-TileColor" content="#2d89ef" />
        
        {/* Main stylesheet from Jekyll build */}
        <link href="/assets/css/style.css" rel="stylesheet" media="screen" />
      </head>
      <body className="mt-2">
        <div className="container">
          <Nav />
          
          <div className="content" id="content" role="main">
            {children}
          </div>
          
          <Footer />
        </div>
        
        {/* Main JavaScript bundle from Jekyll build */}
        <Script src="/assets/js/bundle.js" strategy="afterInteractive" />
      </body>
    </html>
  );
}
