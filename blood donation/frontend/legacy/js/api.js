// Lightweight API client for the Blood Donation website
// Exposes a global `API` object with helper methods.

(function() {
	const DEFAULT_TIMEOUT_MS = 15000;

	function getBaseUrl() {
		const meta = document.querySelector('meta[name="api-base-url"]');
		if (meta && meta.content) return meta.content.replace(/\/$/, '');
		if (window.__API_BASE_URL__) return String(window.__API_BASE_URL__).replace(/\/$/, '');
		return 'http://localhost:3000/api';
	}

	function withTimeout(promise, timeoutMs = DEFAULT_TIMEOUT_MS) {
		return new Promise((resolve, reject) => {
			const timeoutId = setTimeout(() => reject(new Error('Request timed out')), timeoutMs);
			promise
				.then((value) => { clearTimeout(timeoutId); resolve(value); })
				.catch((err) => { clearTimeout(timeoutId); reject(err); });
		});
	}

	async function request(path, { method = 'GET', params, body, headers, timeoutMs } = {}) {
		const baseUrl = getBaseUrl();
		let url = baseUrl + path;
		if (params && typeof params === 'object') {
			const qs = new URLSearchParams(params);
			url += (url.includes('?') ? '&' : '?') + qs.toString();
		}

		const fetchOptions = {
			method,
			headers: {
				'Accept': 'application/json',
				...(body ? { 'Content-Type': 'application/json' } : {}),
				...(headers || {})
			},
			credentials: 'include'
		};

		if (body) fetchOptions.body = JSON.stringify(body);

		const res = await withTimeout(fetch(url, fetchOptions), timeoutMs);
		if (!res.ok) {
			const text = await res.text().catch(() => '');
			throw new Error(`HTTP ${res.status}: ${text || res.statusText}`);
		}
		const contentType = res.headers.get('content-type') || '';
		if (contentType.includes('application/json')) return res.json();
		return res.text();
	}

	async function getStates() {
		try {
			return await request('/locations/states');
		} catch (e) {
			return [
				'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Delhi', 'Uttarakhand', 'West Bengal'
			];
		}
	}

	async function getCities(state) {
		if (!state) return [];
		try {
			return await request('/locations/cities', { params: { state } });
		} catch (e) {
			const fallback = {
				'Delhi': ['Central Delhi', 'East Delhi', 'New Delhi', 'North Delhi', 'South Delhi', 'West Delhi'],
				'Uttarakhand': ['Dehradun', 'Haridwar', 'Nainital', 'Pauri Garhwal', 'Tehri Garhwal', 'Udham Singh Nagar']
			};
			return fallback[state] || [];
		}
	}

	async function searchDonors(criteria) {
		const params = {
			state: criteria.state,
			city: criteria.city,
			blood_group: criteria.blood_group,
			distance: criteria.distance
		};
		try {
			return await request('/donors/search', { params });
		} catch (_) {
			try {
				return await request('/donors/search', { method: 'POST', body: params });
			} catch (e) {
			
				return [];
			}
		}
	}

	async function registerDonor(donor) {
		return request('/donors', { method: 'POST', body: donor });
	}

	async function signIn(credentials) {
		return request('/auth/login', { method: 'POST', body: credentials });
	}

	window.API = {
		setBaseUrl: function(url) { window.__API_BASE_URL__ = String(url).replace(/\/$/, ''); },
		get baseUrl() { return getBaseUrl(); },
		request,
		getStates,
		getCities,
		searchDonors,
		registerDonor,
		signIn
	};
})();


