let leafletPromise;

function loadStylesheet() {
  const existingLink = document.querySelector('link[data-leaflet-loader="true"]');
  if (existingLink) {
    return;
  }

  const link = document.createElement("link");
  link.rel = "stylesheet";
  link.href = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.css";
  link.dataset.leafletLoader = "true";
  document.head.appendChild(link);
}

export function loadLeaflet() {
  if (typeof window === "undefined") {
    return Promise.reject(new Error("Leaflet can only load in the browser."));
  }

  if (window.L) {
    loadStylesheet();
    return Promise.resolve(window.L);
  }

  if (leafletPromise) {
    return leafletPromise;
  }

  leafletPromise = new Promise((resolve, reject) => {
    loadStylesheet();

    const existingScript = document.querySelector(
      'script[data-leaflet-loader="true"]'
    );

    if (existingScript) {
      existingScript.addEventListener("load", () => resolve(window.L));
      existingScript.addEventListener("error", () =>
        reject(new Error("Failed to load Leaflet."))
      );
      return;
    }

    const script = document.createElement("script");
    script.src = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.js";
    script.async = true;
    script.dataset.leafletLoader = "true";
    script.onload = () => resolve(window.L);
    script.onerror = () => reject(new Error("Failed to load Leaflet."));
    document.head.appendChild(script);
  });

  return leafletPromise;
}
