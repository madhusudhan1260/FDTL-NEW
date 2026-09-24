import axios from 'axios';

/**
 * Central HTTP client + mock switch.
 *
 * While VITE_USE_MOCK is not "false", every service resolves data from
 * src/data via `mockResponse`. When the Django REST API is ready, set
 * VITE_USE_MOCK=false and each service's real axios branch is used instead.
 */
export const USE_MOCK = import.meta.env.VITE_USE_MOCK !== 'false';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api',
  timeout: 15000,
  headers: { 'Content-Type': 'application/json' },
});

// Attach the auth token (DRF TokenAuthentication / JWT) to every request.
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('fdtl_token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Normalise errors so pages can show a single human-readable message.
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const message = error.response?.data?.detail || error.message || 'Unexpected server error.';
    return Promise.reject(new Error(message));
  },
);

/** Simulates network latency and returns a detached copy of mock data. */
export function mockResponse(data, delay = 350) {
  return new Promise((resolve) => {
    setTimeout(() => resolve(structuredClone(data)), delay);
  });
}

/** Simulates a failed request (used to demo error states). */
export function mockError(message, delay = 350) {
  return new Promise((_, reject) => {
    setTimeout(() => reject(new Error(message)), delay);
  });
}

/** Case-insensitive match of `query` against any of the given fields. */
export function matchesSearch(record, query, fields) {
  if (!query) return true;
  const needle = query.trim().toLowerCase();
  return fields.some((field) => {
    const value = record[field];
    const text = Array.isArray(value) ? value.join(' ') : String(value ?? '');
    return text.toLowerCase().includes(needle);
  });
}

export default api;
