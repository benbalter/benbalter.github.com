import Link from 'next/link';

interface FooterPage {
  title: string;
  path: string;
}

interface FooterProps {
  footerPages: FooterPage[];
}

export default function Footer({ footerPages }: FooterProps) {
  return (
    <nav>
      <ul className="nav justify-content-end border-top px-2 py-3">
        {footerPages.map((page) => (
          <li className="nav-item" key={page.path}>
            <Link href={page.path} className="nav-link link-secondary">
              {page.title}
            </Link>
          </li>
        ))}
        <li className="nav-item">
          <Link href="/feed.xml" aria-label="Atom Feed" className="nav-link">
            <i className="fas fa-rss" title="Atom Feed"></i>
          </Link>
        </li>
      </ul>
    </nav>
  );
}
