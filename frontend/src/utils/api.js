// src/utils/api.js
export const API_BASE = process.env.REACT_APP_API_BASE_URL || "http://localhost:8080";
export const apiUrl = path => `${API_BASE}${path.startsWith('/') ? '' : '/'}${path}`;