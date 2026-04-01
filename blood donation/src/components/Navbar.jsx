import { NavLink } from "react-router-dom";

const navItems = [
  { to: "/", label: "Home" },
  { to: "/donate", label: "Donate" },
  { to: "/search", label: "Search" },
  { to: "/about", label: "About" },
  { to: "/signin", label: "Sign In" },
];

export default function Navbar() {
  return (
    <nav className="site-nav">
      <div className="container nav-inner">
        <NavLink to="/" className="brand">
          <span className="brand-mark">
            <i className="fas fa-droplet" />
          </span>
          <span className="brand-copy">
            <strong>Blood Donation</strong>
            <small>Community Network</small>
          </span>
        </NavLink>

        <div className="nav-links">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `nav-link${isActive ? " active" : ""}`
              }
            >
              {item.label}
            </NavLink>
          ))}
          <NavLink to="/donate" className="nav-cta">
            Donate Now
          </NavLink>
        </div>
      </div>
    </nav>
  );
}
