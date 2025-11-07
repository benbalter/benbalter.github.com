export default function Nav() {
  return (
    <div className="navbar navbar-expand-md bg-secondary-subtle text-secondary border-start border-end border-bottom border-top rounded-top rounded-bottom mb-3">
      <div className="container-fluid px-3">
        <a className="navbar-brand fw-bold" href="/">Ben Balter</a>
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
            <li className="nav-item">
              <a href="/" className="nav-link">Posts</a>
            </li>
            <li className="nav-item">
              <a href="/about/" className="nav-link">About</a>
            </li>
            <li className="nav-item">
              <a href="/contact/" className="nav-link">Contact</a>
            </li>
          </ul>
        </div>

        <span className="navbar-text text-end">
          Technology leadership, collaboration, and open source
        </span>
      </div>
    </div>
  );
}
