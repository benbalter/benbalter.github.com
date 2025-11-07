import './globals.css';
import type { Metadata } from 'next';

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
      <body>
        <header className="site-header">
          <div className="container">
            <h1 className="site-title">
              <a href="/">Ben Balter</a>
            </h1>
            <nav className="site-nav">
              <a href="/">Home</a>
              <a href="/about">About</a>
              <a href="/contact">Contact</a>
            </nav>
          </div>
        </header>
        <main className="site-content">
          <div className="container">
            {children}
          </div>
        </main>
        <footer className="site-footer">
          <div className="container">
            <p>&copy; {new Date().getFullYear()} Ben Balter</p>
          </div>
        </footer>
      </body>
    </html>
  );
}
