import React from "react";
import "./Navbar.css";
import dashboardImage from "../../assets/dashboard_image.png";
import { useTranslation } from 'react-i18next';
import { t } from 'i18next';

function About() {
  const { t } = useTranslation();
}

const Navbar = ({ toggleSidebar }) => {
  const userName = localStorage.getItem("userName") || "User";
  return (
    <nav className="navbar">
      <button className="hamburger" onClick={toggleSidebar}>
        ☰
      </button>
      <h1 className="navbar-title">{t('dashboard.dashboard')}</h1>
      
      <div className="hero-section">
        <div className="welcome-text">
          <h2>{(`${t('dashboard.welcome_user')}, ${userName}!`)} </h2>
        </div>
        <div className="hero-image">
          
        </div>
      </div>
      <div className="navbar-profile">{t('dashboard.profile')}</div>
    </nav>
  );
};

export default Navbar;
