import { useEffect, useState } from "react";
import { NavLink, useLocation } from "react-router-dom";

const navItems = [
  { to: "/", label: "Home" },
  { to: "/donate", label: "Donate" },
  { to: "/search", label: "Search" },
  { to: "/dashboard", label: "Dashboard" },
  { to: "/about", label: "About" },
  { to: "/signin", label: "Sign In" },
];

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    setIsMenuOpen(false);
  }, [location.pathname]);

  return (
    <nav className={`site-nav${isMenuOpen ? " menu-open" : ""}`}>
      <div className="container nav-inner">
        <NavLink to="/" className="brand">
          <img src="/logo.png" alt="LifeBonder Logo" className="brand-logo" />
          <span className="brand-copy">
            <strong>LifeBonder</strong>
            <small>Blood Donation Platform</small>
          </span>
        </NavLink>

        <button
          type="button"
          className="nav-toggle"
          aria-label="Toggle navigation menu"
          aria-controls="primary-navigation"
          aria-expanded={isMenuOpen}
          onClick={() => setIsMenuOpen((current) => !current)}
        >
          <span />
          <span />
          <span />
        </button>

        <div
          className={`nav-links${isMenuOpen ? " nav-links-open" : ""}`}
          id="primary-navigation"
        >
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              onClick={() => setIsMenuOpen(false)}
              className={({ isActive }) =>
                `nav-link${isActive ? " active" : ""}`
              }
            >
              {item.label}
            </NavLink>
          ))}
          <NavLink
            to="/donate"
            className="nav-cta"
            onClick={() => setIsMenuOpen(false)}
          >
            Donate Now
          </NavLink>
        </div>
      </div>
    </nav>
  );
}
