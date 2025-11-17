import Link from 'next/link';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faRss } from '@fortawesome/free-solid-svg-icons';

interface FooterPage {
  title: string;
  path: string;
}

interface FooterProps {
  footerPages: FooterPage[];
}

/**
 * Footer component (Server Component)
 * Displays site footer navigation with RSS feed link
 * Works with SSG - no client-side JavaScript needed
 */
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
            <FontAwesomeIcon icon={faRss} title="Atom Feed" />
          </Link>
        </li>
      </ul>
    </nav>
  );
}
