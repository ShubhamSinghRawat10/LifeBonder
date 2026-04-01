import { Link } from "react-router-dom";

export default function AboutPage() {
  return (
    <section className="page-section">
      <div className="container narrow">
        <div className="page-card prose">
          <p className="eyebrow">About the platform</p>
          <h1>Helping communities respond faster to blood needs.</h1>
          <p>
            Blood Donation Network is designed to make donor registration,
            awareness, and search simpler for real people during urgent moments.
            The goal is to reduce delay and make local support easier to find.
          </p>

          <div className="impact-strip">
            <div>
              <strong>Simple</strong>
              <span>Cleaner donor registration and search</span>
            </div>
            <div>
              <strong>Local</strong>
              <span>Map-based matching for nearby help</span>
            </div>
            <div>
              <strong>Urgent</strong>
              <span>Built for moments where clarity matters</span>
            </div>
          </div>

          <div className="split-copy">
            <div>
              <h2>Our Mission</h2>
              <p>
                Build a practical digital platform that encourages voluntary
                blood donation and helps connect donors with patients and
                families more efficiently.
              </p>
            </div>
            <div>
              <h2>Our Vision</h2>
              <p>
                Create a reliable donor community where awareness, accessibility,
                and faster response can help reduce blood shortages over time.
              </p>
            </div>
          </div>

          <div className="mini-grid">
            <div>
              <i className="fas fa-heart-pulse" />
              <h3>Save lives</h3>
              <p>One donor registration can support multiple critical cases.</p>
            </div>
            <div>
              <i className="fas fa-clock" />
              <h3>Act faster</h3>
              <p>Search by city and blood group when timing matters most.</p>
            </div>
            <div>
              <i className="fas fa-people-group" />
              <h3>Build community</h3>
              <p>Turn local support into a stronger, more organized network.</p>
            </div>
          </div>

          <div className="hero-actions">
            <Link to="/donate" className="btn btn-primary">
              Become a Donor
            </Link>
            <Link to="/search" className="btn btn-secondary">
              Search Donors
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
