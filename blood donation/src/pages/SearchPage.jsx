import { useMemo, useState } from "react";
import { api } from "../lib/api";
import { bloodGroups, mockDonors, statesAndCities } from "../data";
import GoogleDonorMap from "../components/GoogleDonorMap";

function monthsAgo(dateString) {
  if (!dateString) return "Not available";
  const now = new Date();
  const then = new Date(dateString);
  const months = Math.max(
    0,
    Math.floor((now.getTime() - then.getTime()) / (1000 * 60 * 60 * 24 * 30))
  );
  return `${months} months ago`;
}

function toNumber(value) {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : null;
}

function normalizeDonor(donor, index) {
  return {
    ...donor,
    id: donor.id || `donor-${index + 1}`,
    name: donor.name || donor.fullName || `Donor ${index + 1}`,
    bloodGroup: donor.bloodGroup || donor.blood_group || "Unknown",
    contact: donor.contact || donor.phone || "",
    latitude: toNumber(donor.latitude ?? donor.lat),
    longitude: toNumber(donor.longitude ?? donor.lng),
    lastDonation: donor.lastDonation || donor.last_donation || "",
  };
}

function haversineDistanceKm(from, to) {
  const toRad = (value) => (value * Math.PI) / 180;
  const earthRadiusKm = 6371;
  const latDelta = toRad(to.latitude - from.latitude);
  const lngDelta = toRad(to.longitude - from.longitude);
  const a =
    Math.sin(latDelta / 2) * Math.sin(latDelta / 2) +
    Math.cos(toRad(from.latitude)) *
      Math.cos(toRad(to.latitude)) *
      Math.sin(lngDelta / 2) *
      Math.sin(lngDelta / 2);

  return 2 * earthRadiusKm * Math.asin(Math.sqrt(a));
}

export default function SearchPage() {
  const [filters, setFilters] = useState({
    state: "",
    city: "",
    blood_group: "",
    distance: "10",
  });
  const [results, setResults] = useState([]);
  const [searched, setSearched] = useState(false);
  const [loading, setLoading] = useState(false);
  const [userLocation, setUserLocation] = useState(null);
  const [locationMessage, setLocationMessage] = useState("");
  const [selectedDonorId, setSelectedDonorId] = useState(null);

  const cities = useMemo(
    () => statesAndCities[filters.state] || [],
    [filters.state]
  );

  function updateFilter(event) {
    const { name, value } = event.target;
    setFilters((current) => ({
      ...current,
      [name]: value,
      ...(name === "state" ? { city: "" } : {}),
    }));
  }

  async function useMyLocation() {
    if (!navigator.geolocation) {
      setLocationMessage("Geolocation is not supported in this browser.");
      return;
    }

    setLocationMessage("Detecting your current location...");

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setUserLocation({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        });
        setLocationMessage("Your location is ready. You can now compare nearby donors.");
      },
      () => {
        setLocationMessage(
          "Location access was denied or unavailable. Please allow location to see nearby donors."
        );
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setLoading(true);
    setSearched(true);

    try {
      const liveResults = await api.searchDonors({
        ...filters,
        ...(userLocation
          ? {
              latitude: userLocation.latitude,
              longitude: userLocation.longitude,
            }
          : {}),
      });
      const normalized = Array.isArray(liveResults)
        ? liveResults.map(normalizeDonor)
        : [];
      setResults(normalized);
    } catch {
      const filtered = mockDonors.filter((donor) => {
        return (
          (!filters.state || donor.state === filters.state) &&
          (!filters.city || donor.city === filters.city) &&
          (!filters.blood_group || donor.bloodGroup === filters.blood_group)
        );
      });
      setResults(filtered.map(normalizeDonor));
    } finally {
      setLoading(false);
    }
  }

  const nearestDonor = useMemo(() => {
    if (!userLocation || !results.length) {
      return null;
    }

    const withDistance = results
      .filter(
        (donor) =>
          Number.isFinite(donor.latitude) && Number.isFinite(donor.longitude)
      )
      .map((donor) => ({
        ...donor,
        distanceKm: haversineDistanceKm(userLocation, donor),
      }))
      .sort((a, b) => a.distanceKm - b.distanceKm);

    return withDistance[0] || null;
  }, [results, userLocation]);

  return (
    <section className="page-section">
      <div className="container narrow">
        <div className="page-card">
          <div className="card-head">
            <p className="eyebrow">Search directory</p>
            <h1>Find blood donors near you</h1>
          </div>

          <form className="form-grid" onSubmit={handleSubmit}>
            <label>
              State
              <select name="state" value={filters.state} onChange={updateFilter} required>
                <option value="">Select state</option>
                {Object.keys(statesAndCities).map((state) => (
                  <option key={state} value={state}>
                    {state}
                  </option>
                ))}
              </select>
            </label>

            <label>
              City
              <select
                name="city"
                value={filters.city}
                onChange={updateFilter}
                required
                disabled={!filters.state}
              >
                <option value="">Select city</option>
                {cities.map((city) => (
                  <option key={city} value={city}>
                    {city}
                  </option>
                ))}
              </select>
            </label>

            <label>
              Blood Group
              <select
                name="blood_group"
                value={filters.blood_group}
                onChange={updateFilter}
                required
              >
                <option value="">Select blood group</option>
                {bloodGroups.map((group) => (
                  <option key={group} value={group}>
                    {group}
                  </option>
                ))}
              </select>
            </label>

            <label>
              Distance
              <select name="distance" value={filters.distance} onChange={updateFilter}>
                <option value="5">Within 5 km</option>
                <option value="10">Within 10 km</option>
                <option value="20">Within 20 km</option>
                <option value="50">Within 50 km</option>
                <option value="100">Within 100 km</option>
              </select>
            </label>

            <div className="full-span location-tools">
              <button
                type="button"
                className="btn btn-secondary"
                onClick={useMyLocation}
              >
                Use My Current Location
              </button>
              <p className="helper-text">
                Allow location access to find and highlight the nearest donor around you.
              </p>
              {locationMessage ? (
                <div className="location-message">{locationMessage}</div>
              ) : null}
            </div>

            <button className="btn btn-primary wide full-span" disabled={loading}>
              {loading ? "Searching..." : "Search Donors"}
            </button>
          </form>
        </div>

        {searched ? (
          results.length ? (
            <>
              <div className="page-card map-card">
                <div className="map-card-head">
                  <div>
                    <p className="eyebrow">Map view</p>
                    <h2>Nearest donors on Google Maps</h2>
                  </div>
                  {nearestDonor ? (
                    <div className="nearest-chip">
                      Closest donor: {nearestDonor.name} at{" "}
                      {nearestDonor.distanceKm.toFixed(1)} km
                    </div>
                  ) : null}
                </div>

                <GoogleDonorMap
                  donors={results}
                  userLocation={userLocation}
                  selectedDonorId={selectedDonorId || nearestDonor?.id}
                  onSelectDonor={setSelectedDonorId}
                />
              </div>

              <div className="results-grid">
                {results.map((donor) => {
                  const distanceLabel =
                    userLocation &&
                    Number.isFinite(donor.latitude) &&
                    Number.isFinite(donor.longitude)
                      ? `${haversineDistanceKm(userLocation, donor).toFixed(1)} km away`
                      : null;

                  const isHighlighted =
                    donor.id === (selectedDonorId || nearestDonor?.id);

                  return (
                    <article
                      className={`result-card${isHighlighted ? " result-card-active" : ""}`}
                      key={donor.id}
                      onMouseEnter={() => setSelectedDonorId(donor.id)}
                    >
                      <div className="result-badge">{donor.bloodGroup}</div>
                      <h3>{donor.name}</h3>
                    <p>
                      {donor.city}, {donor.state}
                    </p>
                    <p>Age: {donor.age ?? "Not available"}</p>
                      <p>Last donation: {monthsAgo(donor.lastDonation)}</p>
                      {distanceLabel ? (
                        <p className="distance-pill">{distanceLabel}</p>
                      ) : null}
                      {isHighlighted ? (
                        <p className="nearest-label">Best local match on the map</p>
                      ) : null}
                    <a
                      className="btn btn-secondary"
                      href={`tel:${donor.contact}`}
                    >
                      Contact Donor
                    </a>
                  </article>
                  );
                })}
              </div>
            </>
          ) : (
            <div className="empty-state">
              No donors matched your search. Try another blood group or nearby city.
            </div>
          )
        ) : null}
      </div>
    </section>
  );
}
