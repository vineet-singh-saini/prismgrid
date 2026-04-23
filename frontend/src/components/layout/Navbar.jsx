import { Link } from "react-router-dom";
import "../../styles/navbar.css";

function Navbar() {
  return (
    <header className="navbar-wrap">
      <div className="container">
        <nav className="navbar" aria-label="Primary">
          <Link to="/" className="navbar-brand">
            <div className="brand-mark">
              <span className="brand-core"></span>
            </div>

            <div className="brand-text">
              <h3>PRISM-GRID</h3>
              <p>Infrastructure command intelligence</p>
            </div>
          </Link>

          <div className="navbar-links">
            <a href="#platform">Platform</a>
            <a href="#workflow">Workflow</a>
            <a href="#modules">Modules</a>
            <a href="#production">Production</a>
          </div>

          <div className="navbar-actions">
            <Link to="/login" className="secondary-btn">
              Sign in
            </Link>
            <Link to="/app/dashboard" className="primary-btn">
              Open workspace
            </Link>
          </div>
        </nav>
      </div>
    </header>
  );
}

export default Navbar;
