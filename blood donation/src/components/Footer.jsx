import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="container footer-grid">
        <div>
          <p className="eyebrow">Blood Donation Network</p>
          <h3 className="footer-title">Built to make urgent help easier to find.</h3>
          <p className="footer-copy">
            Register donors, search nearby blood matches, and connect communities
            faster during critical moments.
          </p>
        </div>

        <div className="footer-links">
          <Link to="/">Home</Link>
          <Link to="/donate">Donate</Link>
          <Link to="/search">Search</Link>
          <Link to="/about">About</Link>
          <Link to="/signin">Sign In</Link>
        </div>
      </div>
    </footer>
  );
}
