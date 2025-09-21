import React from "react";
import { useNavigate } from "react-router-dom";
import "./Unauthorized.css";

const Unauthorized = () => {
  const navigate = useNavigate();

  return (
    <div className="unauth-overlay">
      <div className="unauth-card">
        <h2>Access Denied 🚫</h2>
        <p>You don’t have permission to view this page.</p>
        <div className="unauth-actions">
          <button onClick={() => navigate(-1)}>Go Back</button>
          <button onClick={() => navigate("/login")}>Login Again</button>
        </div>
      </div>
    </div>
  );
};

export default Unauthorized;
