import { Link } from "react-router-dom";
import bloodImage from "../../img/blood.jpg";
import binocularsIcon from "../../img/binoculars.png";
import targetIcon from "../../img/target.png";
import goalIcon from "../../img/goal.png";
import CoverageMap from "../components/CoverageMap";
import { bloodGroups, mockDonors, statesAndCities } from "../data";

const quickCities = Object.values(statesAndCities).flat();

export default function HomePage() {
  return (
    <>
      <section className="hero-section">
        <div className="container hero-grid">
          <div className="hero-copy">
            <p className="eyebrow">Donate with confidence</p>
            <h1>Every drop can become someone&apos;s second chance.</h1>
            <p className="hero-text">
              Join a growing network of donors, volunteers, and responders who
              help patients get blood faster when every minute matters.
            </p>

            <div className="hero-stats">
              <div>
                <strong>50K+</strong>
                <span>Lives impacted</span>
              </div>
              <div>
                <strong>10K+</strong>
                <span>Registered donors</span>
              </div>
              <div>
                <strong>100+</strong>
                <span>Connected cities</span>
              </div>
            </div>

            <div className="hero-actions">
              <Link to="/donate" className="btn btn-primary">
                Become a Donor
              </Link>
              <Link to="/search" className="btn btn-secondary">
                Find Donors
              </Link>
            </div>

            <div className="trust-row">
              <span>Location-aware donor search</span>
              <span>Fast registration flow</span>
              <span>Designed for local communities</span>
            </div>
          </div>

          <div className="hero-media">
            <div className="hero-media-card">
              <img src={bloodImage} alt="Blood donation support" />
            </div>
          </div>
        </div>
      </section>

      <section className="section soft-section">
        <div className="container two-column">
          <div className="section-copy">
            <p className="eyebrow">Why this platform</p>
            <h2>Make blood donation simpler, safer, and easier to access.</h2>
            <p>
              This platform helps donors register, lets families search by blood
              group and location, and gives communities a cleaner digital space
              for urgent needs.
            </p>

            <div className="feature-list">
              <div>
                <i className="fas fa-clock" />
                <span>Fast registration and search flow</span>
              </div>
              <div>
                <i className="fas fa-shield-heart" />
                <span>Clear, trustworthy donor information</span>
              </div>
              <div>
                <i className="fas fa-users" />
                <span>Built for local communities and hospitals</span>
              </div>
            </div>
          </div>

          <div className="quick-card">
            <div className="panel-kicker">Quick action</div>
            <h3>Quick donor lookup</h3>
            <p>Jump straight to the search page with a city and blood group.</p>
            <form className="stacked-form" action="/search">
              <label>
                City
                <select name="city" defaultValue="">
                  <option value="" disabled>
                    Select city
                  </option>
                  {quickCities.map((city) => (
                    <option key={city} value={city}>
                      {city}
                    </option>
                  ))}
                </select>
              </label>
              <label>
                Blood Group
                <select name="blood_group" defaultValue="">
                  <option value="" disabled>
                    Select blood group
                  </option>
                  {bloodGroups.map((group) => (
                    <option key={group} value={group}>
                      {group}
                    </option>
                  ))}
                </select>
              </label>
              <button type="submit" className="btn btn-primary wide">
                Search Donors
              </button>
            </form>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="section-heading">
            <p className="eyebrow">Our foundation</p>
            <h2>Built around awareness, access, and action.</h2>
            <p className="section-lead">
              A focused digital experience for people who need clarity quickly,
              whether they are registering as a donor or searching during an emergency.
            </p>
          </div>

          <div className="card-grid">
            <article className="info-card">
              <img src={binocularsIcon} alt="Vision icon" />
              <h3>Our Vision</h3>
              <p>
                Create a connected donation ecosystem where people can find help
                quickly and donors can participate regularly with confidence.
              </p>
            </article>
            <article className="info-card">
              <img src={targetIcon} alt="Goal icon" />
              <h3>Our Goal</h3>
              <p>
                Reduce blood shortages by making it easier to register donors,
                search by location, and raise awareness in everyday life.
              </p>
            </article>
            <article className="info-card">
              <img src={goalIcon} alt="Mission icon" />
              <h3>Our Mission</h3>
              <p>
                Support urgent care with a platform that is easy to use, mobile
                friendly, and ready to connect donors with people in need.
              </p>
            </article>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="section-heading">
            <p className="eyebrow">Coverage map</p>
            <h2>See where the donor network is already active.</h2>
            <p className="section-lead">
              A built-in map now gives visitors an instant sense of local reach
              and how the search experience will feel once they begin looking
              for donors.
            </p>
          </div>

          <CoverageMap donors={mockDonors} />
        </div>
      </section>

      <section className="section cta-band">
        <div className="container center-copy">
          <p className="eyebrow">Ready to help</p>
          <h2>One registration can help save multiple lives.</h2>
          <p>
            Start by joining the donor network or searching for compatible
            donors near you.
          </p>
          <div className="hero-actions center-actions">
            <Link to="/donate" className="btn btn-primary">
              Register Now
            </Link>
            <Link to="/about" className="btn btn-secondary">
              Learn More
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
