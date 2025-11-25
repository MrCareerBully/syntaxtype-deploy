import React from 'react';
import { Navigate } from 'react-router-dom';
import { getAuthToken } from '../utils/AuthUtils';

const PublicOnlyRoute = ({ children }) => {
    const token = getAuthToken(); // Check if a JWT token exists

    if (token) {
        // If a token exists, the user is logged in, redirect to dashboard
        return <Navigate to="/dashboard" replace />;
    }

    // If no token, user is not logged in, render the child components (login/register page)
    return children;
};

export default PublicOnlyRoute;