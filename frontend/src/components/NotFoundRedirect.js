// src/components/NotFoundRedirect.js
import React, { useEffect, useState } from 'react'; // Import useState
import { useNavigate } from 'react-router-dom';
import { getAuthToken } from '../utils/AuthUtils'; // Needed to check if user is logged in

const NotFoundRedirect = () => {
    const navigate = useNavigate();
    const [seconds, setSeconds] = useState(3); // Initialize countdown state to 3 seconds

    useEffect(() => {
        // Set up the countdown timer
        const countdownTimer = setInterval(() => {
            setSeconds(prevSeconds => prevSeconds - 1);
        }, 1000); // Decrement every 1000ms (1 second)

        // Set up the redirection timer
        const redirectTimer = setTimeout(() => {
            clearInterval(countdownTimer); // Clear the countdown interval
            const token = getAuthToken(); // Get the current token
            if (token) {
                navigate('/dashboard'); // Redirect to dashboard if logged in
            } else {
                navigate('/login'); // Redirect to login if not logged in
            }
        }, 3000); // Redirect after 3000 milliseconds (3 seconds)

        // Cleanup function: Clear both timers if the component unmounts early
        return () => {
            clearInterval(countdownTimer);
            clearTimeout(redirectTimer);
        };
    }, [navigate]); // Dependency array: navigate is stable, so effect runs once

    return (
        <div style={{ backgroundColor: '#f3f4f6', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}>
            <div style={{ backgroundColor: '#ffffff', padding: '2rem', borderRadius: '0.5rem', boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)', width: '100%', maxWidth: '28rem', textAlign: 'center' }}>
                <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '1rem' }}>Page Not Found</h2>
                <p style={{ color: '#4b5563', marginBottom: '1rem' }}>
                    The page you are looking for does not exist.
                </p>
                <p style={{ color: '#4b5563', fontSize: '1.1rem', fontWeight: 'bold' }}>
                    Redirecting to the dashboard in {seconds} seconds...
                </p>
            </div>
        </div>
    );
};

export default NotFoundRedirect;