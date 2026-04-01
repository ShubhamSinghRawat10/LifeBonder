import { useEffect, useMemo, useRef, useState } from "react";
import { loadGoogleMaps } from "../lib/googleMaps";

export default function GoogleDonorMap({
  donors,
  userLocation,
  selectedDonorId,
  onSelectDonor,
}) {
  const mapRef = useRef(null);
  const [status, setStatus] = useState("idle");
  const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;

  const mapDonors = useMemo(
    () =>
      donors.filter(
        (donor) =>
          Number.isFinite(donor.latitude) && Number.isFinite(donor.longitude)
      ),
    [donors]
  );

  useEffect(() => {
    let isActive = true;

    async function renderMap() {
      if (!mapRef.current || !mapDonors.length || !apiKey) {
        return;
      }

      setStatus("loading");

      try {
        const maps = await loadGoogleMaps(apiKey);
        const { Map, InfoWindow } = await maps.importLibrary("maps");
        const { AdvancedMarkerElement, PinElement } =
          await maps.importLibrary("marker");

        if (!isActive || !mapRef.current) {
          return;
        }

        const fallbackCenter = {
          lat: mapDonors[0].latitude,
          lng: mapDonors[0].longitude,
        };

        const center = userLocation
          ? { lat: userLocation.latitude, lng: userLocation.longitude }
          : fallbackCenter;

        const map = new Map(mapRef.current, {
          center,
          zoom: userLocation ? 11 : 9,
          mapId: "blood-donation-map",
          disableDefaultUI: false,
        });

        const bounds = new maps.LatLngBounds();
        const infoWindow = new InfoWindow();

        if (userLocation) {
          const userPin = new PinElement({
            glyph: "You",
            background: "#111827",
            borderColor: "#111827",
            glyphColor: "#ffffff",
          });

          new AdvancedMarkerElement({
            map,
            position: {
              lat: userLocation.latitude,
              lng: userLocation.longitude,
            },
            title: "Your current location",
            content: userPin.element,
          });

          bounds.extend({
            lat: userLocation.latitude,
            lng: userLocation.longitude,
          });
        }

        mapDonors.forEach((donor) => {
          const isSelected = donor.id === selectedDonorId;
          const pin = new PinElement({
            glyph: donor.bloodGroup || donor.blood_group || "D",
            background: isSelected ? "#8f1022" : "#d62839",
            borderColor: isSelected ? "#8f1022" : "#d62839",
            glyphColor: "#ffffff",
          });

          const marker = new AdvancedMarkerElement({
            map,
            position: {
              lat: donor.latitude,
              lng: donor.longitude,
            },
            title: donor.name || donor.fullName || "Donor",
            content: pin.element,
          });

          marker.addListener("click", () => {
            onSelectDonor?.(donor.id);
            infoWindow.setContent(
              `
                <div style="min-width:180px">
                  <strong>${donor.name || donor.fullName || "Donor"}</strong>
                  <div>${donor.city}, ${donor.state}</div>
                  <div>Blood Group: ${donor.bloodGroup || donor.blood_group || "Unknown"}</div>
                  <div>Phone: ${donor.contact || donor.phone || "Not available"}</div>
                </div>
              `
            );
            infoWindow.open({ map, anchor: marker });
          });

          bounds.extend({
            lat: donor.latitude,
            lng: donor.longitude,
          });
        });

        if (!bounds.isEmpty()) {
          map.fitBounds(bounds, 70);
        }

        setStatus("ready");
      } catch (error) {
        if (isActive) {
          setStatus("error");
        }
      }
    }

    renderMap();

    return () => {
      isActive = false;
    };
  }, [apiKey, mapDonors, onSelectDonor, selectedDonorId, userLocation]);

  if (!apiKey) {
    return (
      <div className="map-placeholder">
        Add `VITE_GOOGLE_MAPS_API_KEY` to your environment to enable the live
        Google Map view.
      </div>
    );
  }

  if (!mapDonors.length) {
    return (
      <div className="map-placeholder">
        No donor coordinates are available for these results yet.
      </div>
    );
  }

  return (
    <div className="map-shell">
      {status === "loading" ? (
        <div className="map-status">Loading Google Map...</div>
      ) : null}
      {status === "error" ? (
        <div className="map-status error">
          Google Map could not load. Check the API key, billing, and allowed
          referrers.
        </div>
      ) : null}
      <div ref={mapRef} className="donor-map" />
    </div>
  );
}
