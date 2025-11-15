export default function Footer() {
  return (
    <nav>
      <ul className="nav justify-content-end border-top px-2 py-3">
        <li className="nav-item">
          <a href="/other-recommended-reading/" className="nav-link link-secondary">
            Other Recommended Reading
          </a>
        </li>
        <li className="nav-item">
          <a href="/fine-print/" className="nav-link link-secondary">
            Fine Print
          </a>
        </li>
        <li className="nav-item">
          <a href="/feed.xml" aria-label="Atom Feed" className="nav-link">
            <i className="fas fa-rss" title="Atom Feed"></i>
          </a>
        </li>
      </ul>
    </nav>
  );
}
