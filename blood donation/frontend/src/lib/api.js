const DEFAULT_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:3000/api";

function getBaseUrl() {
  return (
    (typeof window !== "undefined" && window.__API_BASE_URL__) ||
    DEFAULT_BASE_URL
  );
}

async function request(path, options = {}) {
  const response = await fetch(`${getBaseUrl()}${path}`, {
    credentials: "include",
    headers: {
      Accept: "application/json",
      ...(options.body ? { "Content-Type": "application/json" } : {}),
      ...(options.headers || {}),
    },
    ...options,
  });

  if (!response.ok) {
    throw new Error(`Request failed with status ${response.status}`);
  }

  const contentType = response.headers.get("content-type") || "";
  if (contentType.includes("application/json")) {
    return response.json();
  }

  return response.text();
}

export const api = {
  request,
  signIn(payload) {
    return request("/auth/login", {
      method: "POST",
      body: JSON.stringify(payload),
    });
  },
  registerDonor(payload) {
    return request("/donors", {
      method: "POST",
      body: JSON.stringify(payload),
    });
  },
  searchDonors(query) {
    const params = new URLSearchParams(query);
    return request(`/donors/search?${params.toString()}`);
  },
};
