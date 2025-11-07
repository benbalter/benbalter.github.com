import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Ben Balter',
  description: 'Technology leadership, collaboration, and open source',
  authors: [{ name: 'Ben Balter', url: 'https://ben.balter.com' }],
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://ben.balter.com',
    siteName: 'Ben Balter',
  },
  twitter: {
    card: 'summary_large_image',
    site: '@benbalter',
    creator: '@benbalter',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
        <link rel="manifest" href="/site.webmanifest" />
      </head>
      <body>
        <div className="site-wrapper">
          <header className="site-header">
            <nav className="nav">
              <div className="container">
                <h1 className="site-title">
                  <a href="/">Ben Balter</a>
                </h1>
                <ul className="nav-links">
                  <li><a href="/">Home</a></li>
                  <li><a href="/about">About</a></li>
                  <li><a href="/contact">Contact</a></li>
                </ul>
              </div>
            </nav>
          </header>
          <main className="site-content">
            {children}
          </main>
          <footer className="site-footer">
            <div className="container">
              <p>&copy; {new Date().getFullYear()} Ben Balter. Content: <a href="http://creativecommons.org/licenses/by/3.0/">CC BY 3.0</a></p>
              <div className="footer-links">
                <a href="/fine-print">Fine Print</a> | 
                <a href="/other-recommended-reading">Recommended Reading</a>
              </div>
            </div>
          </footer>
        </div>
      </body>
    </html>
  )
}
