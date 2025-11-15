'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

interface NavPage {
  title: string;
  path: string;
}

const navPages: NavPage[] = [
  { title: 'Posts', path: '/' },
  { title: 'About', path: '/about/' },
  { title: 'Contact', path: '/contact/' },
];

export default function Navigation() {
  const pathname = usePathname();
  
  return (
    <div className="navbar navbar-expand-md bg-secondary-subtle text-secondary border-start border-end border-bottom border-top rounded-top rounded-bottom mb-3">
      <div className="container-fluid px-3">
        <Link className="navbar-brand fw-bold" href="/">
          Ben Balter
        </Link>
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbar"
          aria-controls="navbar"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="navbar" role="navigation">
          <ul className="navbar-nav mr-auto">
            {navPages.map((page) => (
              <li className="nav-item" key={page.path}>
                <Link
                  href={page.path}
                  className={`nav-link${pathname === page.path ? ' active' : ''}`}
                >
                  {page.title}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <span className="navbar-text text-end">
          Technology leadership, collaboration, and open source
        </span>
      </div>
    </div>
  );
}
