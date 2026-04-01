let googleMapsPromise;

export function loadGoogleMaps(apiKey) {
  if (!apiKey) {
    return Promise.reject(
      new Error("Missing Google Maps API key. Set VITE_GOOGLE_MAPS_API_KEY.")
    );
  }

  if (window.google?.maps) {
    return Promise.resolve(window.google.maps);
  }

  if (googleMapsPromise) {
    return googleMapsPromise;
  }

  googleMapsPromise = new Promise((resolve, reject) => {
    const existingScript = document.querySelector(
      'script[data-google-maps-loader="true"]'
    );

    if (existingScript) {
      existingScript.addEventListener("load", () => resolve(window.google.maps));
      existingScript.addEventListener("error", () =>
        reject(new Error("Failed to load Google Maps script."))
      );
      return;
    }

    const script = document.createElement("script");
    script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&v=weekly&loading=async`;
    script.async = true;
    script.defer = true;
    script.dataset.googleMapsLoader = "true";
    script.onload = () => resolve(window.google.maps);
    script.onerror = () =>
      reject(new Error("Failed to load Google Maps script."));
    document.head.appendChild(script);
  });

  return googleMapsPromise;
}
