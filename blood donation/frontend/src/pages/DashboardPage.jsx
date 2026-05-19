import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { activeEmergencies, bloodGroups, mockDonors } from "../data";
import { api } from "../lib/api";

function normalizeDonor(donor, index) {
  return {
    ...donor,
    id: donor.id || donor._id || `donor-${index + 1}`,
    name: donor.name || donor.fullName || `Donor ${index + 1}`,
    bloodGroup: donor.bloodGroup || donor.blood_group || "Unknown",
    phone: donor.phone || donor.contact || "",
    city: donor.city || "Unknown city",
    state: donor.state || "Unknown state",
    isAvailable: donor.isAvailable !== false,
  };
}

function buildCityLabel(city, state) {
  return state ? `${city}, ${state}` : city;
}

function MetricCard({ label, value, detail, tone = "default" }) {
  return (
    <article className={`metric-card metric-card-${tone}`}>
      <span>{label}</span>
      <strong>{value}</strong>
      <p>{detail}</p>
    </article>
  );
}

function AvailabilityChart({ stats }) {
  const maxCount = Math.max(...stats.map((item) => item.count), 1);

  return (
    <div className="availability-chart" aria-label="Available donors by blood group">
      {stats.map((item) => {
        const width = item.count ? Math.max((item.count / maxCount) * 100, 12) : 0;

        return (
          <div className="availability-row" key={item.group}>
            <div className="blood-chip">{item.group}</div>
            <div className="availability-track" aria-hidden="true">
              <span style={{ width: `${width}%` }} />
            </div>
            <strong>{item.count}</strong>
          </div>
        );
      })}
    </div>
  );
}

function CityStats({ cities }) {
  const maxCount = Math.max(...cities.map((item) => item.count), 1);

  return (
    <div className="city-stat-list">
      {cities.map((item, index) => (
        <div className="city-stat-row" key={`${item.city}-${item.state}`}>
          <span className="city-rank">{index + 1}</span>
          <div className="city-stat-main">
            <div className="city-stat-copy">
              <strong>{item.city}</strong>
              <span>{item.state}</span>
            </div>
            <div className="city-track" aria-hidden="true">
              <span style={{ width: `${Math.max((item.count / maxCount) * 100, 10)}%` }} />
            </div>
          </div>
          <div className="city-stat-count">
            <strong>{item.count}</strong>
            <span>donors</span>
          </div>
        </div>
      ))}
    </div>
  );
}

function EmergencyCard({ emergency, availableDonors }) {
  const localMatches = availableDonors.filter(
    (donor) =>
      donor.bloodGroup === emergency.bloodGroup &&
      donor.city === emergency.city &&
      donor.state === emergency.state
  ).length;
  const stateMatches = availableDonors.filter(
    (donor) =>
      donor.bloodGroup === emergency.bloodGroup && donor.state === emergency.state
  ).length;
  const fillRate = Math.min(
    100,
    Math.round((emergency.unitsMatched / emergency.unitsNeeded) * 100)
  );
  const unitsOpen = Math.max(
    emergency.unitsNeeded - emergency.unitsMatched,
    0
  );

  return (
    <article className="emergency-card">
      <div className="emergency-card-head">
        <div>
          <span className={`priority-badge priority-${emergency.priority.toLowerCase()}`}>
            {emergency.priority}
          </span>
          <h3>{emergency.hospital}</h3>
          <p>{buildCityLabel(emergency.city, emergency.state)}</p>
        </div>
        <div className="emergency-blood">{emergency.bloodGroup}</div>
      </div>

      <div className="emergency-progress">
        <div>
          <strong>{unitsOpen}</strong>
          <span>units open</span>
        </div>
        <div className="emergency-track" aria-hidden="true">
          <span style={{ width: `${fillRate}%` }} />
        </div>
        <small>
          {emergency.unitsMatched} of {emergency.unitsNeeded} units matched
        </small>
      </div>

      <div className="emergency-meta">
        <span>{emergency.responseWindow}</span>
        <span>{localMatches} local matches</span>
        <span>{stateMatches} state matches</span>
      </div>

      <a className="btn btn-secondary wide" href={`tel:${emergency.contact}`}>
        Contact Hospital
      </a>
    </article>
  );
}

export default function DashboardPage() {
  const [donors, setDonors] = useState(() => mockDonors.map(normalizeDonor));
  const [isLoading, setIsLoading] = useState(true);
  const [dataSource, setDataSource] = useState("sample");

  useEffect(() => {
    let isMounted = true;

    async function loadDonors() {
      setIsLoading(true);

      try {
        const response = await api.listAvailableDonors();
        const liveDonors = Array.isArray(response)
          ? response.map(normalizeDonor).filter((donor) => donor.isAvailable)
          : [];

        if (isMounted && liveDonors.length) {
          setDonors(liveDonors);
          setDataSource("live");
        }
      } catch {
        if (isMounted) {
          setDonors(mockDonors.map(normalizeDonor));
          setDataSource("sample");
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    loadDonors();

    return () => {
      isMounted = false;
    };
  }, []);

  const availableDonors = useMemo(
    () => donors.filter((donor) => donor.isAvailable),
    [donors]
  );

  const dashboard = useMemo(() => {
    const bloodStats = bloodGroups.map((group) => ({
      group,
      count: availableDonors.filter((donor) => donor.bloodGroup === group).length,
    }));

    const cityMap = availableDonors.reduce((acc, donor) => {
      const key = `${donor.city}-${donor.state}`;
      acc[key] = acc[key] || {
        city: donor.city,
        state: donor.state,
        count: 0,
      };
      acc[key].count += 1;
      return acc;
    }, {});

    const cityStats = Object.values(cityMap)
      .sort((a, b) => b.count - a.count || a.city.localeCompare(b.city))
      .slice(0, 6);

    const urgentUnits = activeEmergencies.reduce(
      (sum, emergency) =>
        sum + Math.max(emergency.unitsNeeded - emergency.unitsMatched, 0),
      0
    );
    const coveredBloodGroups = bloodStats.filter((item) => item.count > 0).length;
    const criticalCases = activeEmergencies.filter(
      (emergency) => emergency.priority === "Critical"
    ).length;

    return {
      bloodStats,
      cityStats,
      totalDonors: availableDonors.length,
      totalCities: Object.keys(cityMap).length,
      urgentUnits,
      coveredBloodGroups,
      criticalCases,
    };
  }, [availableDonors]);

  return (
    <section className="page-section dashboard-page">
      <div className="container dashboard-shell">
        <div className="dashboard-hero">
          <div className="dashboard-copy">
            <p className="eyebrow">Live availability</p>
            <h1>Blood availability dashboard</h1>
            <p>
              Track donor availability by blood group, compare city coverage,
              and prioritize active emergency requests from one operational view.
            </p>
            <div className="dashboard-actions">
              <Link to="/search" className="btn btn-primary">
                Find Donors
              </Link>
              <Link to="/donate" className="btn btn-secondary">
                Add Donor
              </Link>
            </div>
          </div>

          <div className="dashboard-status-panel">
            <span className={`live-dot ${dataSource === "live" ? "online" : ""}`} />
            <strong>{dataSource === "live" ? "Connected to donor API" : "Sample data mode"}</strong>
            <p>
              {isLoading
                ? "Refreshing donor availability..."
                : `${dashboard.totalDonors} available donors across ${dashboard.totalCities} cities`}
            </p>
          </div>
        </div>

        <div className="metric-grid">
          <MetricCard
            label="Available donors"
            value={dashboard.totalDonors}
            detail={`${dashboard.coveredBloodGroups} of ${bloodGroups.length} blood groups covered`}
            tone="red"
          />
          <MetricCard
            label="Cities active"
            value={dashboard.totalCities}
            detail="City-wise donor coverage"
            tone="blue"
          />
          <MetricCard
            label="Active emergencies"
            value={activeEmergencies.length}
            detail={`${dashboard.criticalCases} critical cases`}
            tone="amber"
          />
          <MetricCard
            label="Open units"
            value={dashboard.urgentUnits}
            detail="Still needed by hospitals"
            tone="green"
          />
        </div>

        <div className="dashboard-layout">
          <section className="analytics-panel blood-panel">
            <div className="panel-head">
              <div>
                <p className="eyebrow">Blood groups</p>
                <h2>Available donors by blood group</h2>
              </div>
              <span>{dashboard.coveredBloodGroups}/{bloodGroups.length} covered</span>
            </div>
            <AvailabilityChart stats={dashboard.bloodStats} />
          </section>

          <section className="analytics-panel city-panel">
            <div className="panel-head">
              <div>
                <p className="eyebrow">City stats</p>
                <h2>Top active cities</h2>
              </div>
              <span>{dashboard.totalCities} cities</span>
            </div>
            <CityStats cities={dashboard.cityStats} />
          </section>
        </div>

        <section className="analytics-panel emergencies-panel">
          <div className="panel-head">
            <div>
              <p className="eyebrow">Emergency queue</p>
              <h2>Active emergencies</h2>
            </div>
            <span>{dashboard.urgentUnits} units open</span>
          </div>

          <div className="emergency-grid">
            {activeEmergencies.map((emergency) => (
              <EmergencyCard
                key={emergency.id}
                emergency={emergency}
                availableDonors={availableDonors}
              />
            ))}
          </div>
        </section>
      </div>
    </section>
  );
}
