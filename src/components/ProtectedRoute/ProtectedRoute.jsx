// components/ProtectedRoute.jsx
import React from "react";
import { Navigate } from "react-router-dom";
import "./ProtectedRoute.css";

const ProtectedRoute = ({ children, allowedRoles }) => {
  const rawUser = localStorage.getItem("user");
  let user = null;

  try {
    user = rawUser ? JSON.parse(rawUser) : null;
  } catch (e) {
    user = null;
  }

  if (!user) {
    // Not logged in → popup
    return (
      <div className="popup-overlay">
        <div className="popup">
          <h2>Login Required</h2>
          <p>You must be logged in to access this page.</p>
          <button onClick={() => (window.location.href = "/login")}>
            Go to Login
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
