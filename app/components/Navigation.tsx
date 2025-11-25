import Link from 'next/link';

type NavigationProperties = {
  title: string;
  description: string;
  navPages: Array<{title: string; path: string}>;
};

// Inline script to add 'active' class to the current navigation link
// This runs client-side after the page loads to highlight the active nav item
// Using an IIFE to avoid polluting global scope, with DOM readiness check
const navActiveScript = `
(function() {
  function setActiveLink() {
    var pathname = window.location.pathname;
    // Normalize pathname: ensure trailing slash for consistency
    var normalizedPath = pathname.endsWith('/') ? pathname : pathname + '/';
    var links = document.querySelectorAll('[data-nav-path]');
    for (var i = 0; i < links.length; i++) {
      var linkPath = links[i].getAttribute('data-nav-path');
      // Handle root path specially (exact match only)
      if (linkPath === '/') {
        if (pathname === '/' || pathname === '') {
          links[i].classList.add('active');
        }
      } else {
        // For other paths, compare with normalized version
        var normalizedLinkPath = linkPath.endsWith('/') ? linkPath : linkPath + '/';
        if (normalizedPath === normalizedLinkPath) {
          links[i].classList.add('active');
        }
      }
    }
  }
  // Run immediately if DOM is ready, otherwise wait for DOMContentLoaded
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', setActiveLink);
  } else {
    setActiveLink();
  }
})();
`;

export default function Navigation({title, description, navPages}: NavigationProperties) {
  return (
    <div className='navbar navbar-expand-md bg-secondary-subtle text-secondary border-start border-end border-bottom border-top rounded-top rounded-bottom mb-3'>
      <div className='container-fluid px-3'>
        <Link className='navbar-brand fw-bold' href='/'>
          {title}
        </Link>
        <button
          className='navbar-toggler'
          type='button'
          data-bs-toggle='collapse'
          data-bs-target='#navbar'
          aria-controls='navbar'
          aria-expanded='false'
          aria-label='Toggle navigation'
        >
          <span className='navbar-toggler-icon'></span>
        </button>

        <div className='collapse navbar-collapse' id='navbar' role='navigation'>
          <ul className='navbar-nav mr-auto'>
            {navPages.map(page => (
              <li className='nav-item' key={page.path}>
                <Link
                  href={page.path}
                  className='nav-link'
                  data-nav-path={page.path}
                >
                  {page.title}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <span className='navbar-text text-end'>
          {description}
        </span>
      </div>
      <script dangerouslySetInnerHTML={{__html: navActiveScript}} />
    </div>
  );
}
