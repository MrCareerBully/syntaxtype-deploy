// src/utils/JwtUtils.js
import { jwtDecode } from 'jwt-decode'; // You'll need to install this library
import { setAuthToken } from './AuthUtils'; // Import for logout functionality

export const decodeJwt = (token) => {
    try {
        return jwtDecode(token);
    } catch (error) {
        console.error("Error decoding JWT:", error);
        // Error decoding (e.g., malformed token).
        // The calling function will handle the implications.
        return null;
    }
};

// Internal helper function to validate the token, check expiry, and handle logout.
// Returns the decoded token if valid and not expired, otherwise null.
const handleTokenValidation = (token) => {
    if (!token) { // Handles null, undefined, or empty string token
        return null;
    }

    const decoded = decodeJwt(token);

    if (!decoded) {
        // Token was present but malformed or couldn't be decoded.
        console.warn("Malformed JWT token detected. Logging out.");
        setAuthToken(null); // Trigger logout
        return null;
    }

    if (typeof decoded.exp === 'undefined') {
        // Token is structurally valid but missing the 'exp' (expiration) claim.
        // For session management, an 'exp' claim is typically expected.
        console.warn("JWT token is missing the 'exp' (expiration) claim. Logging out.");
        setAuthToken(null); // Trigger logout
        return null;
    }

    const currentTimeInSeconds = Date.now() / 1000;
    if (decoded.exp < currentTimeInSeconds) {
        console.warn("JWT token has expired. Logging out.");
        setAuthToken(null); // Trigger logout
        return null;
    }

    return decoded; // Token is valid and not expired
};

export const getUserRole = (token) => {
    const decodedToken = decodeJwt(token);
    return decodedToken ? decodedToken.role : null;
};

export const getUserId = (token) => {
    const decodedToken = decodeJwt(token);
    return decodedToken ? decodedToken.id : null;
};

export const getUsername = (token) => {
    const decodedToken = decodeJwt(token);
    return decodedToken ? decodedToken.sub : null; // 'sub' is the subject, which you set as username
};

export const getIsTempPassword = (token) => {
    const decodedToken = decodeJwt(token);
    return decodedToken ? decodedToken.isTempPassword === true : false; // Explicitly check for true
};