import { useMemo, useState } from "react";
import { api } from "../lib/api";
import { bloodGroups, statesAndCities } from "../data";

const initialForm = {
  name: "",
  email: "",
  phone: "",
  age: "",
  blood_group: "",
  state: "",
  city: "",
  latitude: "",
  longitude: "",
  publicListingConsent: false,
  sharePhone: false,
};

export default function DonatePage() {
  const [form, setForm] = useState(initialForm);
  const [status, setStatus] = useState({ type: "", message: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [locationMessage, setLocationMessage] = useState("");

  const cities = useMemo(() => statesAndCities[form.state] || [], [form.state]);

  function updateField(event) {
    const { name, type, checked, value } = event.target;
    setForm((current) => ({
      ...current,
      [name]: type === "checkbox" ? checked : value,
      ...(name === "sharePhone" && !checked ? { phone: "" } : {}),
      ...(name === "state" ? { city: "" } : {}),
    }));
  }

  function useMyLocation() {
    if (!navigator.geolocation) {
      setLocationMessage("Geolocation is not supported in this browser.");
      return;
    }

    setLocationMessage("Detecting your current location...");

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setForm((current) => ({
          ...current,
          latitude: String(position.coords.latitude),
          longitude: String(position.coords.longitude),
        }));
        setLocationMessage("Location captured. Your donor profile can now appear on the map.");
      },
      () => {
        setLocationMessage(
          "Location access was denied. You can still register without map coordinates."
        );
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setStatus({ type: "", message: "" });

    const age = Number(form.age);
    if (!Number.isInteger(age) || age < 18 || age > 65) {
      setStatus({ type: "error", message: "Age must be between 18 and 65." });
      return;
    }

    if (form.sharePhone && !/^\d{10}$/.test(form.phone)) {
      setStatus({
        type: "error",
        message: "Enter a valid 10-digit phone number to allow direct contact.",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      await api.registerDonor(form);
      setStatus({
        type: "success",
        message: "Registration submitted successfully.",
      });
      setForm(initialForm);
    } catch (error) {
      setStatus({
        type: "error",
        message: error.message || "Registration failed. Please try again.",
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <section className="page-section">
      <div className="container narrow">
        <div className="form-layout">
          <aside className="side-panel">
            <p className="eyebrow">Donor form</p>
            <h1>Register as a blood donor</h1>
            <p>
              Create a profile so people nearby can find the right blood group
              quickly when there is an urgent need.
            </p>
            <div className="side-points">
              <div>Share your city and blood group</div>
              <div>Optional location is used to sort nearby matches and is never shown</div>
              <div>Stay visible for faster local matching</div>
            </div>
          </aside>

          <div className="page-card">
            <form className="form-grid" onSubmit={handleSubmit}>
              <label>
                Full Name
                <input name="name" value={form.name} onChange={updateField} required />
              </label>
              <label className="full-span">
                Email (kept private)
                <input type="email" name="email" value={form.email} onChange={updateField} required />
              </label>
              <label className="full-span">
                Phone Number
                <input name="phone" value={form.phone} onChange={updateField} inputMode="numeric" maxLength="10" required={form.sharePhone} />
              </label>
              <label>
                Age
                <input
                  type="number"
                  min="18"
                  max="65"
                  name="age"
                  value={form.age}
                  onChange={updateField}
                  required
                />
              </label>
              <label>
                Blood Group
                <select
                  name="blood_group"
                  value={form.blood_group}
                  onChange={updateField}
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
                State
                <select name="state" value={form.state} onChange={updateField} required>
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
                  value={form.city}
                  onChange={updateField}
                  required
                  disabled={!form.state}
                >
                  <option value="">Select city</option>
                  {cities.map((city) => (
                    <option key={city} value={city}>
                      {city}
                    </option>
                  ))}
                </select>
              </label>
              <label className="check-row full-span">
                <input type="checkbox" name="publicListingConsent" checked={form.publicListingConsent} onChange={updateField} required />
                <span>I agree to appear in donor searches. My name, blood group, and city will be visible to people searching. My address and precise location will never be shown.</span>
              </label>
              <label className="check-row full-span">
                <input type="checkbox" name="sharePhone" checked={form.sharePhone} onChange={updateField} />
                <span>Show my phone number in search results so people can contact me directly. If unchecked, my phone number is not required or shown.</span>
              </label>

              <div className="full-span location-tools">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={useMyLocation}
                >
                  Use My Current Location for Map
                </button>
                <p className="helper-text">
                  Used only to sort nearby matches. Your exact coordinates are never returned to searchers.
                </p>
                {locationMessage ? (
                  <div className="location-message">{locationMessage}</div>
                ) : null}
              </div>

              {status.message ? (
                <div className={`form-message ${status.type}`}>{status.message}</div>
              ) : null}

              <button className="btn btn-primary wide full-span" disabled={isSubmitting}>
                {isSubmitting ? "Registering..." : "Register as Donor"}
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
