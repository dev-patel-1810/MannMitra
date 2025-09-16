// components/ProtectedRoute.jsx
import React, { useState, useEffect } from "react";
import { Navigate } from "react-router-dom";
import "./ProtectedRoute.css";

const ProtectedRoute = ({ children }) => {
  const [showPopup, setShowPopup] = useState(false);
  const user = localStorage.getItem("user");

  useEffect(() => {
    if (!user) {
      setShowPopup(true);
    }
  }, [user]);

  if (!user) {
    return (
      <>
        {showPopup && (
          <div className="popup-overlay">
            <div className="popup">
              <h2>Login Required</h2>
              <p>You must be logged in to access the test.</p>
              <button onClick={() => (window.location.href = "/login")}>
                Go to Login
              </button>
            </div>
          </div>
        )}
      </>
    );
  }

  return children;
};

export default ProtectedRoute;
