import React, { useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';

// IMPORTANT: Please ensure these paths are correct relative to RegisterPage.js (src/pages/RegisterPage.js)
// and that the files exist in src/utils/ with the correct casing.
// import { setAuthToken } from '../utils/AuthUtils'; // Not directly used in RegisterPage
// import { getUserId, getUserRole } from '../utils/JwtUtils'; // Not directly used in RegisterPage

// Material-UI Imports
import {
    Container,
    Box,
    Typography,
    TextField,
    Button,
    Alert,
    CircularProgress
} from '@mui/material';

const RegisterPage = () => {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    const [message, setMessage] = useState({ text: '', type: '' });
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState({}); // State to hold validation errors
    const navigate = useNavigate();

    const validateForm = () => {
        let tempErrors = {};
        if (!username) tempErrors.username = "Username is required.";
        if (!email) tempErrors.email = "Email is required.";
        if (!password) tempErrors.password = "Password is required.";
        if (!confirmPassword) tempErrors.confirmPassword = "Confirm Password is required.";
        if (password && confirmPassword && password !== confirmPassword) {
            tempErrors.confirmPassword = "Passwords do not match.";
        }
        setErrors(tempErrors);
        return Object.keys(tempErrors).length === 0;
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        setMessage({ text: '', type: '' });

        if (!validateForm()) {
            return; // Stop if validation fails
        }

        setLoading(true);

        try {
            const response = await axios.post('/api/auth/register/student', {
                username,
                email,
                password,
            });

            setMessage({ text: 'Registration successful! You can now log in.', type: 'success' });
            setTimeout(() => navigate('/login'), 2000);
        } catch (error) {
            console.error('Registration error:', error);
            let errorMessage = 'Registration failed. Please try again.';

            if (error.response && error.response.data) {
                if (typeof error.response.data === 'object' && error.response.data !== null) {
                    errorMessage = error.response.data.message || error.response.data.error || JSON.stringify(error.response.data);
                } else {
                    errorMessage = error.response.data;
                }
            } else if (error.message) {
                errorMessage = error.message;
            }

            if (error.response && error.response.status === 409) {
                errorMessage = errorMessage.includes("username") ? "Username already exists." :
                               (errorMessage.includes("email") ? "Email already exists." : "Username or email already exists.");
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
                padding: '1rem',
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
                    alignItems: 'center',
                }}
            >
                <Typography
                    component="h1"
                    variant="h5"
                    sx={{
                        fontWeight: 'bold',
                        textAlign: 'center',
                        marginBottom: '1.5rem',
                        color: '#1f2937',
                    }}
                >
                    Register
                </Typography>

                {message.text && (
                    <Alert
                        severity={message.type === 'success' ? 'success' : 'error'}
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
                        id="username"
                        label="Username"
                        name="username"
                        autoComplete="username"
                        autoFocus
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        variant="outlined"
                        size="small"
                        error={!!errors.username}
                        helperText={errors.username}
                    />
                    <TextField
                        margin="normal"
                        required
                        fullWidth
                        id="email"
                        label="Email Address (for login)"
                        name="email"
                        autoComplete="email"
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
                        autoComplete="new-password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        variant="outlined"
                        size="small"
                        error={!!errors.password}
                        helperText={errors.password}
                    />
                    <TextField
                        margin="normal"
                        required
                        fullWidth
                        name="confirmPassword"
                        label="Confirm Password"
                        type="password"
                        id="confirmPassword"
                        autoComplete="new-password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        variant="outlined"
                        size="small"
                        error={!!errors.confirmPassword}
                        helperText={errors.confirmPassword}
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
                                backgroundColor: '#1d4ed8',
                            },
                            borderRadius: '0.375rem',
                            textTransform: 'none',
                            padding: '0.5rem 1rem',
                        }}
                        disabled={loading}
                    >
                        {loading ? <CircularProgress size={24} color="inherit" /> : 'Register'}
                    </Button>
                    <Typography
                        variant="body2"
                        sx={{
                            textAlign: 'center',
                            fontSize: '0.875rem',
                            color: '#4b5563',
                            marginTop: '1rem',
                        }}
                    >
                        Already have an account?{' '}
                        <Link to="/login" style={{ color: '#2563eb', textDecoration: 'underline' }}>
                            Login here
                        </Link>
                    </Typography>
                </Box>
            </Box>
        </Container>
    );
};

export default RegisterPage;
