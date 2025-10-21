import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import './Sidebar.css';

const Sidebar = () => {
  const location = useLocation();

  return (
    <div className="sidebar">
      <div className="sidebar-header">
        <div className="logo">MannMitra</div>
        <div className="profile-section">
          <div className="profile-icon">👤</div>
          <div className="profile-text">Counsellor</div>
          <div className="profile-subtext">Profile</div>
        </div>
      </div>

      <nav className="sidebar-nav">
        <Link 
          to="/dashboard/counsellor" 
          className={`nav-item ${location.pathname === '/dashboard/counsellor' ? 'active' : ''}`}
        >
          <span className="nav-icon">🏠</span>
          <span>Dashboard</span>
        </Link>

        <Link 
          to="/appointments" 
          className={`nav-item ${location.pathname === '/appointments' ? 'active' : ''}`}
        >
          <span className="nav-icon">📅</span>
          <span>Appointments</span>
        </Link>

        <Link 
          to="/students" 
          className={`nav-item ${location.pathname === '/students' ? 'active' : ''}`}
        >
          <div className="nav-item-with-badge">
            <span className="nav-icon">👥</span>
            <span>Students</span>
            
          </div>
        </Link>

        <Link 
          to="/analytics" 
          className={`nav-item ${location.pathname === '/analytics' ? 'active' : ''}`}
        >
          <span className="nav-icon">📊</span>
          <span>Analytics</span>
        </Link>
      </nav>

      <div className="sidebar-footer">
        <button className="logout-button">
          <span className="nav-icon">🚪</span>
          <span>Logout</span>
        </button>
      </div>
    </div>
  );
};

export default Sidebar;