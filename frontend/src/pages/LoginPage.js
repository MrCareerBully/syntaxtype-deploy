import React, { useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import { setAuthToken } from '../utils/AuthUtils';
import { getUserId, getUserRole } from '../utils/JwtUtils';
import {
    Container,
    Box,
    Typography,
    TextField,
    Button,
    Alert,
    CircularProgress
} from '@mui/material';

import { API_BASE } from '../utils/api';

const LoginPage = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState({ text: '', type: '' });
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState({});
    const navigate = useNavigate();

    const validateForm = () => {
        const tempErrors = {};
        if (!email) tempErrors.email = 'Email is required.';
        if (!password) tempErrors.password = 'Password is required.';
        setErrors(tempErrors);
        return Object.keys(tempErrors).length === 0;
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        setMessage({ text: '', type: '' });

        if (!validateForm()) return;

        setLoading(true);

        try {
            const response = await axios.post(`${API_BASE}/api/auth/login`, {
                email,
                password
            });

            const token = response.data.token;

            if (token) {
                setAuthToken(token);

                const userId = getUserId(token);
                const userRole = getUserRole(token);

                // ✅ Store user info in sessionStorage
                sessionStorage.setItem('token', token);
                sessionStorage.setItem('userId', userId);
                sessionStorage.setItem('role', userRole);

                // ✅ Debug log (optional)
                console.log('Logged in user:', { userId, userRole });

                if (userRole === 'STUDENT' && userId) {
                    try {
                        const studentDetailsResponse = await axios.get(
                            `/api/students/user/${userId}`,
                            {
                                headers: {
                                    Authorization: `Bearer ${token}`
                                }
                            }
                        );

                        const studentData = studentDetailsResponse.data;

                        if (!studentData || Object.keys(studentData).length === 0) {
                            setMessage({
                                text: 'Please complete your student profile.',
                                type: 'info'
                            });
                            navigate('/student-details-form');
                        } else {
                            setMessage({ text: 'Login successful!', type: 'success' });
                            navigate('/dashboard');
                        }
                    } catch (studentError) {
                        if (studentError.response?.status === 404) {
                            setMessage({
                                text: 'Please complete your student profile.',
                                type: 'info'
                            });
                            navigate('/student-details-form');
                        } else {
                            console.error('Student profile check failed:', studentError);
                            setMessage({
                                text: 'Login successful, but profile check failed. Proceeding to dashboard.',
                                type: 'warning'
                            });
                            navigate('/dashboard');
                        }
                    }
                } else {
                    setMessage({ text: 'Login successful!', type: 'success' });
                    navigate('/dashboard');
                }
            } else {
                setMessage({ text: 'Login successful, but no token received.', type: 'error' });
            }
        } catch (error) {
            console.error('Login error:', error);
            let errorMessage = 'Login failed. Please check your credentials.';

            if (error.response?.data) {
                const data = error.response.data;
                if (typeof data === 'object' && data !== null) {
                    errorMessage = data.message || data.error || JSON.stringify(data);
                } else {
                    errorMessage = data;
                }
            } else if (error.message) {
                errorMessage = error.message;
            }

            setMessage({ text: errorMessage, type: 'error' });
        } finally {
            setLoading(false);
        }
    };

    return (
        <Container
            component="main"
            maxWidth="xs"
            sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                minHeight: '100vh',
                backgroundColor: '#f3f4f6',
                padding: '1rem'
            }}
        >
            <Box
                sx={{
                    backgroundColor: '#ffffff',
                    padding: '2rem',
                    borderRadius: '0.5rem',
                    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
                    width: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center'
                }}
            >
                <Typography
                    component="h1"
                    variant="h5"
                    sx={{
                        fontWeight: 'bold',
                        textAlign: 'center',
                        marginBottom: '1.5rem',
                        color: '#1f2937'
                    }}
                >
                    Login
                </Typography>

                {message.text && (
                    <Alert
                        severity={message.type}
                        sx={{ width: '100%', marginBottom: '1rem' }}
                    >
                        {message.text}
                    </Alert>
                )}

                <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1, width: '100%' }}>
                    <TextField
                        margin="normal"
                        required
                        fullWidth
                        id="email"
                        label="Email Address"
                        name="email"
                        autoComplete="email"
                        autoFocus
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        variant="outlined"
                        size="small"
                        error={!!errors.email}
                        helperText={errors.email}
                    />
                    <TextField
                        margin="normal"
                        required
                        fullWidth
                        name="password"
                        label="Password"
                        type="password"
                        id="password"
                        autoComplete="current-password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        variant="outlined"
                        size="small"
                        error={!!errors.password}
                        helperText={errors.password}
                    />
                    <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        sx={{
                            mt: 3,
                            mb: 2,
                            backgroundColor: '#2563eb',
                            '&:hover': {
                                backgroundColor: '#1d4ed8'
                            },
                            borderRadius: '0.375rem',
                            textTransform: 'none',
                            padding: '0.5rem 1rem'
                        }}
                        disabled={loading}
                    >
                        {loading ? <CircularProgress size={24} color="inherit" /> : 'Login'}
                    </Button>
                    <Typography
                        variant="body2"
                        sx={{
                            textAlign: 'center',
                            fontSize: '0.875rem',
                            color: '#4b5563',
                            marginTop: '1rem'
                        }}
                    >
                        Don't have an account?{' '}
                        <Link to="/register" style={{ color: '#2563eb', textDecoration: 'underline' }}>
                            Register here
                        </Link>
                    </Typography>
                </Box>
            </Box>
        </Container>
    );
};

export default LoginPage;
