// src/components/ProtectedRoute.js
import React, { useEffect, useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom'; // Import useLocation
import axios from 'axios'; // Import axios for API calls
import { getAuthToken } from '../utils/AuthUtils';
import { getUserRole, getUserId, getIsTempPassword } from '../utils/JwtUtils';

const ProtectedRoute = ({ children, allowedRoles }) => {
    const [isLoading, setIsLoading] = useState(true);
    const [authStatus, setAuthStatus] = useState({
        isAuthenticated: false,
        isAuthorized: false,
        userRole: null,
        isStudentProfileComplete: true,
        isTempPassword: false, // New state for temporary password check
        isTeacherProfileComplete: true, // New state for teacher profile check
    });

    const token = getAuthToken();
    const location = useLocation(); // Get current location using useLocation hook

    useEffect(() => {
        setIsLoading(true); // Ensure loading state is true when effect runs
        const checkAuthAndProfile = async () => {
            if (!token) {
                setAuthStatus({
                    isAuthenticated: false,
                    isAuthorized: false,
                    userRole: null,
                    isStudentProfileComplete: true,
                    isTempPassword: false,
                    isTeacherProfileComplete: true,
                })
                setIsLoading(false);
                return;
            }

            const currentUserId = getUserId(token);
            const currentUserRole = getUserRole(token);
            const isTemporaryPassword = getIsTempPassword(token);

            const authorized = !allowedRoles || allowedRoles.length === 0 || (currentUserRole && allowedRoles.includes(currentUserRole));
            let studentProfileComplete = true; // Default to true
            let teacherProfileComplete = true; // Default to true

            if (authorized && currentUserRole === 'STUDENT' && currentUserId) {
                try {
                    // Check if student details exist for the logged-in student
                    const studentDetailsResponse = await axios.get(`/api/students/user/${currentUserId}`, {
                        headers: {
                            Authorization: `Bearer ${token}`
                        }
                    });
                    // If data is empty or specific fields are missing, consider profile incomplete
                    // This check might need to be more robust based on what "complete" means
                    if (!studentDetailsResponse.data || Object.keys(studentDetailsResponse.data).length === 0) {
                        studentProfileComplete = false;
                    } else {
                        studentProfileComplete = true;
                    }
                } catch (error) {
                    // If 404, it means no student profile exists for this userId
                    if (error.response && error.response.status === 404) {
                        studentProfileComplete = false;
                    } else {
                        // Log other errors but still allow access if authenticated and authorized for the route
                        console.error('Error checking student profile:', error);
                        studentProfileComplete = true; // Assume complete to not block unnecessarily on API errors
                    }
                }
            } else if (authorized && currentUserRole === 'TEACHER' && currentUserId && !isTemporaryPassword) {
                // Only check teacher profile if password is not temporary
                try {
                    // Check if teacher details exist for the logged-in teacher
                    const teacherDetailsResponse = await axios.get(`/api/teachers/user/${currentUserId}`, {
                        headers: {
                            Authorization: `Bearer ${token}`
                        }
                    });
                    if (!teacherDetailsResponse.data || Object.keys(teacherDetailsResponse.data).length === 0) {
                        teacherProfileComplete = false;
                    } else {
                        teacherProfileComplete = true;
                    }
                } catch (error) {
                    // If 404, it means no teacher profile exists for this userId
                    if (error.response && error.response.status === 404) {
                        teacherProfileComplete = false;
                    } else {
                        // Log other errors but still allow access if authenticated and authorized for the route
                        console.error('Error checking teacher profile:', error);
                        teacherProfileComplete = true; // Assume complete to not block unnecessarily on API errors
                    }
                }
            }
            

            setAuthStatus({
                isAuthenticated: true,
                isAuthorized: authorized,
                userRole: currentUserRole,
                isStudentProfileComplete: studentProfileComplete,
                isTempPassword: isTemporaryPassword,
                isTeacherProfileComplete: teacherProfileComplete,
            });
            setIsLoading(false);
        };

        checkAuthAndProfile();
    }, [token, allowedRoles]); // Re-run effect if token or allowedRoles change

    if (isLoading) {
        return <div>Loading authentication...</div>; // Or a spinner
    }

    if (!authStatus.isAuthenticated) {
        return <Navigate to="/login" replace />;
    }

    if (!authStatus.isAuthorized) {
        return <Navigate to="/unauthorized" replace />;
    }

    // TEACHER ACCOUNT SETUP CHECK (takes precedence over profile completion)
    if (authStatus.userRole === 'TEACHER') {
        if (authStatus.isTempPassword) {
            if (location.pathname !== '/teacher-setup-account') {
                return <Navigate to="/teacher-setup-account" replace state={{ from: location }} />;
            }
            // Allow access if already on the setup page
        } else {
            // Password is not temporary, if user tries to access setup page, redirect them
            if (location.pathname === '/teacher-setup-account') {
                const fromPath = location.state?.from?.pathname;
                const redirectTo = (fromPath && fromPath !== '/teacher-setup-account') ? fromPath : '/dashboard';
                return <Navigate to={redirectTo} replace />;
            }
        }
    }

    //STUDENT PROFILE CHECK

    // If a student with a complete profile tries to access the student details form,
    // redirect them to their previous location (if available via state) or the dashboard.
    if (
        authStatus.userRole === 'STUDENT' &&
        authStatus.isStudentProfileComplete &&
        location.pathname === '/student-details-form'
    ) {
        const fromPath = location.state?.from?.pathname;
        // Redirect to 'fromPath' if it exists and is not the current page, otherwise to dashboard.
        const redirectTo = (fromPath && fromPath !== '/student-details-form') ? fromPath : '/dashboard';
        return <Navigate to={redirectTo} replace />;
    }

    // If a student's profile is incomplete, and they are trying to access
    // any protected route other than the student details form, redirect them to the form.
    if (
        authStatus.userRole === 'STUDENT' &&
        !authStatus.isStudentProfileComplete &&
        location.pathname !== '/student-details-form'
    ) {
        // Pass the current location as 'from' state. StudentDetailsForm can use this
        // to redirect the user back after profile completion.
        return <Navigate to="/student-details-form" replace state={{ from: location }} />;
    }

    //TEACHER PROFILE CHECK (only if password is not temporary)
    if (authStatus.userRole === 'TEACHER' && !authStatus.isTempPassword) {
        // If a teacher with a complete profile tries to access the teacher details form,
        // redirect them to their previous location (if available via state) or the dashboard.
        if (
            authStatus.userRole === 'TEACHER' &&
            authStatus.isTeacherProfileComplete &&
            location.pathname === '/teacher-details-form'
        ) {
            const fromPath = location.state?.from?.pathname;
            // Redirect to 'fromPath' if it exists and is not the current page, otherwise to dashboard.
            const redirectTo = (fromPath && fromPath !== '/teacher-details-form') ? fromPath : '/dashboard';
            return <Navigate to={redirectTo} replace />;
        }

        // If a teacher's profile is incomplete, and they are trying to access
        // any protected route other than the teacher details form, redirect them to the form.
        if (
            authStatus.userRole === 'TEACHER' &&
            !authStatus.isTeacherProfileComplete &&
            location.pathname !== '/teacher-details-form'
        ) {
            return <Navigate to="/teacher-details-form" replace state={{ from: location }} />;
        }
    }

    return children;
};

export default ProtectedRoute;