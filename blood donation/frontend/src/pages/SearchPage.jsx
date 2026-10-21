import { useMemo, useState } from "react";
import { api } from "../lib/api";
import { bloodGroups, statesAndCities } from "../data";

function normalizeDonor(donor, index) {
  return {
    ...donor,
    id: donor.id || `donor-${index + 1}`,
    name: donor.name || donor.fullName || `Donor ${index + 1}`,
    bloodGroup: donor.bloodGroup || donor.blood_group || "Unknown",
    contact: donor.contact || donor.phone || "",
  };
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
  const [searchError, setSearchError] = useState("");
  const [contactDonor, setContactDonor] = useState(null);
  const [copiedPhone, setCopiedPhone] = useState(false);

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
        setLocationMessage("Location will be sent only with your search request and is not saved by the app.");
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
    setSearchError("");
    setSelectedDonorId(null);

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
    } catch (error) {
      setResults([]);
      setSearchError(error.message || "Donor search is unavailable. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  async function copyDonorPhone() {
    if (!contactDonor?.contact || !navigator.clipboard?.writeText) return;
    try {
      await navigator.clipboard.writeText(contactDonor.contact);
      setCopiedPhone(true);
    } catch {
      setCopiedPhone(false);
    }
  }

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
                    <p className="eyebrow">Privacy-first matching</p>
                    <h2>Nearby donor matches</h2>
                  </div>
                  <div className="nearest-chip">Sorted by proximity. Exact donor locations are kept private.</div>
                </div>
                <p className="helper-text">For privacy, individual map pins and precise locations are not displayed. When you share your location, the server uses it to sort matches by distance and does not save it. Results show city only.</p>
              </div>

              <div className="results-grid">
                {results.map((donor) => {
                  const isHighlighted = donor.id === selectedDonorId;

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
                      {isHighlighted ? (
                        <p className="nearest-label">Selected donor</p>
                      ) : null}
                    {donor.contact ? <button
                      className="btn btn-secondary"
                      type="button"
                      onClick={() => {
                        setCopiedPhone(false);
                        setContactDonor(donor);
                      }}
                    >
                      Contact Donor
                    </button> : <p className="helper-text">This donor chose not to share a phone number.</p>}
                  </article>
                  );
                })}
              </div>
            </>
          ) : searchError ? (
            <div className="empty-state" role="alert">{searchError}</div>
          ) : (
            <div className="empty-state">
              No donors matched your search. Try another blood group or nearby city.
            </div>
          )
        ) : null}
      </div>
      {contactDonor ? (
        <div
          className="contact-dialog-backdrop"
          onClick={() => setContactDonor(null)}
        >
          <section
            className="contact-dialog"
            role="dialog"
            aria-modal="true"
            aria-labelledby="contact-dialog-title"
            onClick={(event) => event.stopPropagation()}
          >
            <p className="eyebrow">Donor contact</p>
            <h2 id="contact-dialog-title">Contact {contactDonor.name}</h2>
            <p>Call the number this donor chose to share:</p>
            <a className="contact-phone" href={`tel:${contactDonor.contact}`}>
              {contactDonor.contact}
            </a>
            <div className="contact-dialog-actions">
              <a className="btn btn-primary" href={`tel:${contactDonor.contact}`}>
                Call Donor
              </a>
              <button className="btn btn-secondary" type="button" onClick={copyDonorPhone}>
                {copiedPhone ? "Number Copied" : "Copy Number"}
              </button>
              <button className="btn btn-secondary" type="button" onClick={() => setContactDonor(null)}>
                Close
              </button>
            </div>
          </section>
        </div>
      ) : null}
    </section>
  );
}
