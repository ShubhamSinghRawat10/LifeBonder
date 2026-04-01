import { useEffect, useMemo, useRef, useState } from "react";
import { loadLeaflet } from "../lib/leaflet";

export default function CoverageMap({ donors }) {
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const markersRef = useRef([]);
  const [selectedId, setSelectedId] = useState(donors[0]?.id ?? null);
  const [status, setStatus] = useState("loading");

  const selectedDonor = useMemo(
    () => donors.find((donor) => donor.id === selectedId) ?? donors[0],
    [donors, selectedId]
  );

  useEffect(() => {
    let isActive = true;
    let resizeObserver;

    async function setupMap() {
      if (!mapRef.current || !donors.length) {
        return;
      }

      try {
        const L = await loadLeaflet();

        if (!isActive || !mapRef.current) {
          return;
        }

        if (!mapInstanceRef.current) {
          mapInstanceRef.current = L.map(mapRef.current, {
            zoomControl: true,
            scrollWheelZoom: true,
          }).setView([donors[0].latitude, donors[0].longitude], 5);

          L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
            attribution: "&copy; OpenStreetMap contributors",
            maxZoom: 19,
          }).addTo(mapInstanceRef.current);
        }

        markersRef.current.forEach((marker) => marker.remove());
        markersRef.current = donors.map((donor) => {
          const icon = L.divIcon({
            className: "donor-marker",
            html: `<span>${donor.bloodGroup}</span>`,
            iconSize: [46, 46],
            iconAnchor: [23, 23],
          });

          const marker = L.marker([donor.latitude, donor.longitude], {
            icon,
          }).addTo(mapInstanceRef.current);

          marker.bindPopup(
            `
              <div class="leaflet-popup-card">
                <strong>${donor.name}</strong>
                <div>${donor.city}, ${donor.state}</div>
                <div>Blood Group: ${donor.bloodGroup}</div>
              </div>
            `
          );

          marker.on("click", () => setSelectedId(donor.id));
          return marker;
        });

        const bounds = L.latLngBounds(
          donors.map((donor) => [donor.latitude, donor.longitude])
        );
        mapInstanceRef.current.fitBounds(bounds, { padding: [40, 40] });
        requestAnimationFrame(() => mapInstanceRef.current?.invalidateSize());

        resizeObserver = new ResizeObserver(() => {
          mapInstanceRef.current?.invalidateSize();
        });
        resizeObserver.observe(mapRef.current);

        setStatus("ready");
      } catch {
        if (isActive) {
          setStatus("error");
        }
      }
    }

    setupMap();

    return () => {
      isActive = false;
      resizeObserver?.disconnect();
    };
  }, [donors]);

  useEffect(() => {
    if (!selectedDonor || !mapInstanceRef.current || !markersRef.current.length) {
      return;
    }

    const markerIndex = donors.findIndex((donor) => donor.id === selectedDonor.id);
    const marker = markersRef.current[markerIndex];

    mapInstanceRef.current.flyTo([selectedDonor.latitude, selectedDonor.longitude], 9, {
      duration: 0.8,
    });

    if (marker) {
      marker.openPopup();
    }

    requestAnimationFrame(() => mapInstanceRef.current?.invalidateSize());
  }, [donors, selectedDonor]);

  if (!selectedDonor) {
    return null;
  }

  return (
    <div className="coverage-experience">
      <div className="coverage-toolbar">
        {donors.map((donor) => {
          const isActive = donor.id === selectedDonor.id;

          return (
            <button
              key={donor.id}
              type="button"
              className={`coverage-pill${isActive ? " coverage-pill-active" : ""}`}
              onClick={() => setSelectedId(donor.id)}
            >
              <strong>{donor.city}</strong>
              <span>{donor.bloodGroup}</span>
            </button>
          );
        })}
      </div>

      <div className="coverage-panel">
        <div className="coverage-map-wrap">
          <div className="coverage-map-head">
            <div>
              <p className="eyebrow">Interactive map</p>
              <h3>Zoom into donor locations</h3>
            </div>
            <p className="coverage-map-note">
              Drag, zoom, and click a donor pin to inspect the area.
            </p>
          </div>

          {status === "loading" ? (
            <div className="map-status">Loading interactive map...</div>
          ) : null}
          {status === "error" ? (
            <div className="map-status error">
              The zoomable map could not load right now.
            </div>
          ) : null}
          <div ref={mapRef} className="coverage-map" />
        </div>
      </div>

      <div className="coverage-sidebar">
        <div className="coverage-highlight">
          <div className="coverage-badge">{selectedDonor.bloodGroup}</div>
          <strong>
            {selectedDonor.city}, {selectedDonor.state}
          </strong>
          <span>
            Focused on {selectedDonor.name}, age {selectedDonor.age}. Use the pills
            above or the map pins to switch locations smoothly.
          </span>
        </div>

        <div className="coverage-copy">
          <h4>What this map gives users</h4>
          <ul className="coverage-points">
            <li>Natural zoom and pan controls</li>
            <li>Immediate city-to-city switching</li>
            <li>Visible donor pins with blood group labels</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
