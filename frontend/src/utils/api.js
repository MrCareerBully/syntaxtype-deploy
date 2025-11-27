// Use this helper in your frontend code to construct safe API URLs.
// It falls back to relative paths in development (via proxy) and uses
// REACT_APP_API_BASE_URL in production builds.
export function resolveApi(path) {
  // ensure the path starts with /
  if (!path.startsWith('/')) path = `/${path}`;
  return `${API_BASE}${path}`;
}
// src/utils/api.js
export const API_BASE = process.env.REACT_APP_API_BASE_URL || "http://localhost:8080";
export const apiUrl = path => `${API_BASE}${path.startsWith('/') ? '' : '/'}${path}`;