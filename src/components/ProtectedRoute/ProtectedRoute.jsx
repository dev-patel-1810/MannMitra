// components/ProtectedRoute.jsx
import React from "react";
import { Navigate } from "react-router-dom";
import "./ProtectedRoute.css";
import { useTranslation } from 'react-i18next';
import { t } from 'i18next';

function About() {
  const { t } = useTranslation();
}

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
