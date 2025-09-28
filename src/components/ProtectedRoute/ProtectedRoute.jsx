// components/ProtectedRoute.jsx
import React, { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import "./ProtectedRoute.css";
import { useTranslation } from 'react-i18next';

const ProtectedRoute = ({ children, allowedRoles }) => {
  const { t } = useTranslation();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Always check with the server first to validate cookies
    const validateAuth = async () => {
      try {
        // Always try to validate with the server first
        const response = await fetch('http://localhost:5000/validate-token', {
          method: 'GET',
          credentials: 'include', // Important: include cookies in the request
        });
        
        if (response.ok) {
          const data = await response.json();
          // Save user data to localStorage for future checks
          localStorage.setItem("user", JSON.stringify(data.user));
          
          // Also save tokens to localStorage as backup
          if (data.user.accessToken) {
            localStorage.setItem('accessToken', data.user.accessToken);
          }
          
          setUser(data.user);
          setLoading(false);
          return;
        }
      } catch (error) {
        console.error("Server validation error:", error);
        // Continue to fallback methods
      }
      
      // Fallback: Try to get user from localStorage
      try {
        const rawUser = localStorage.getItem("user");
        const userData = rawUser ? JSON.parse(rawUser) : null;
        if (userData) {
          // If we have user data in localStorage, try to use it
          // and silently attempt to revalidate with the server
          setUser(userData);
          setLoading(false);
          
          // Try to refresh the session in the background
          fetch('http://localhost:5000/validate-token', {
            method: 'GET',
            credentials: 'include',
            headers: {
              'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
            }
          }).catch(e => console.log('Background session refresh attempt'));
          
          return;
        }
      } catch (e) {
        console.error("Error parsing user data from localStorage:", e);
      }
      
      // No valid authentication found
      setUser(null);
      setLoading(false);
    };
    
    validateAuth();
  }, []);

  // No loading state shown - silently check authentication in background
  if (loading) {
    return children; // Show the actual page content while checking auth
  }

  if (!user) {
    // Not logged in → popup
    return (
      <div className="popup-overlay">
        <div className="popup">
          <h2>{t('dashboard.login_required')}</h2>
          <p>{t('dashboard.login_required_message')}</p>
          <button onClick={() => (window.location.href = "/login")}>
            {t('dashboard.go_to_login')}
          </button>
        </div>
      </div>
    );
  }

  if (allowedRoles && !allowedRoles.includes(user.userType)) {
    // Logged in but role not allowed
    return <Navigate to="/unauthorized" replace />;
  }

  // Authorized → render page
  return children;
};

export default ProtectedRoute;
