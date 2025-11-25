// src/utils/AuthUtils.js
import axios from 'axios';

const TOKEN_STORAGE_KEY = 'jwtToken';
const AUTH_CHANGE_EVENT = 'authChange'; // Define a custom event name

export const setAuthToken = (token) => {
    if (token) {
        // Apply to every request header
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        // Store in localStorage
        localStorage.setItem(TOKEN_STORAGE_KEY, token);
    } else {
        // Delete auth header
        delete axios.defaults.headers.common['Authorization'];
        // Remove from localStorage
        localStorage.removeItem(TOKEN_STORAGE_KEY);
    }
    // Dispatch a custom event whenever the auth token changes
    window.dispatchEvent(new Event(AUTH_CHANGE_EVENT));
};

export const getAuthToken = () => {
    return localStorage.getItem(TOKEN_STORAGE_KEY);
};

// Function to subscribe to auth changes for other components
export const subscribeToAuthChanges = (callback) => {
    const handler = () => callback(!!getAuthToken());
    window.addEventListener(AUTH_CHANGE_EVENT, handler);
    return () => window.removeEventListener(AUTH_CHANGE_EVENT, handler);
};

// Initialize token on app load (e.g., in App.js or index.js)
const token = getAuthToken();
if (token) {
    setAuthToken(token); // This will also dispatch the event if token was already there
}
