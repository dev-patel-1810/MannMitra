import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from 'react-i18next';

// External components (kept as-is)
import MoodCard from "../../components/MoodCard/MoodCard";
import ChatPrompt from "../../components/ChatPrompt/ChatPrompt";
import ModuleCard from "../../components/ModuleCard/ModuleCard";
import ExploreSection from "../../components/ExploreSection/ExploreSection";
import ResourceHub from "../../components/ResourceHub/ResourceHub";
import Schedule from "../../components/Schedule/Schedule";
import WellnessTasks from "../../components/WellnessTasks/WellnessTasks";
import BookNowCard from "../../components/BookNowCard/BookNowCard";

// Import module icons
import peerIcon from '../../assets/peer_group.jpg';
import counselorIcon from '../../assets/your_counsellor.jpg';
import analyticsIcon from '../../assets/analytics.jpg';
import testIcon from '../../assets/take_test.jpg';

import heroImg from '../../assets/hero.png'; 

import "./Dash_student.css";

// ================= NAVBAR =================
const Navbar = ({ selectedLanguage, handleLanguageChange, handleLogout }) => {
  const { t } = useTranslation();

  return (
    <nav className="navbar">
      <div className="navbar-center">
        <span>{t("dashboard.dashboard")}</span>
        <span>{t("dashboard.peer")}</span>
        <span>{t("dashboard.analytics")}</span>
        <span>{t("dashboard.resource_hub")}</span>
      </div>

      <div className="navbar-right">
        <select
          className="language-select-std"
          value={selectedLanguage}
          onChange={handleLanguageChange}
        >
          <option value="en">English</option>
          <option value="hi">Hindi</option>
          <option value="doi">Dogri</option>
        </select>
        <button className="logout-btn" onClick={handleLogout}>
          {t("dashboard.logout")}
        </button>
      </div>
    </nav>
  );
};

// ================= SIDEBAR =================
const Sidebar = ({ isOpen }) => {
  const navigate = useNavigate();
  const { t } = useTranslation();

  const handleLogout = () => {
    if (window.confirm(t('dashboard.confirm_logout'))) {
      localStorage.removeItem("user");
      navigate("/");
    }
  };

  return (
    <aside className={`sidebar ${isOpen ? "open" : "closed"}`}>
      <ul>
        <li className="sidebar-item">{t('dashboard.dashboard')}</li>
        <li className="sidebar-item">{t('dashboard.schedule')}</li>
        <li className="sidebar-item">{t('dashboard.peer')}</li>
        <li className="sidebar-item">{t('dashboard.analytics')}</li>
        <li className="sidebar-item">{t('dashboard.resource_hub')}</li>
        <li
          className="sidebar-item"
          onClick={handleLogout}
          style={{ cursor: "pointer", color: "red" }}
        >
          {t('dashboard.logout')}
        </li>
      </ul>
    </aside>
  );
};

// ================= MAIN DASHBOARD =================
const Dashboard = () => {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();

  const [sidebarOpen, setSidebarOpen] = useState(false); // closed by default
  const [selectedLanguage, setSelectedLanguage] = useState(() => {
    const storedLang = localStorage.getItem('appLanguage');
    return storedLang || 'en';
  });

  // Sync language selection with i18n + localStorage
  useEffect(() => {
    i18n.changeLanguage(selectedLanguage);
    localStorage.setItem('appLanguage', selectedLanguage);
  }, [i18n, selectedLanguage]);

  const handleLanguageChange = (event) => {
    const lang = event.target.value;
    setSelectedLanguage(lang);
  };

  const handleLogout = () => {
    if (window.confirm(t('dashboard.confirm_logout'))) {
      localStorage.removeItem("user");
      navigate("/");
    }
  };

  const modules = [
    { title: t('dashboard.peer'), icon: peerIcon, color: '#B63C65' },
    { title: t('modal.counsellorTitle'), icon: counselorIcon, color: '#2653A0' },
    { title: t('dashboard.analytics'), icon: analyticsIcon, color: '#54BABE' },
    { title: t('dashboard.take_test'), icon: testIcon, color: '#FAAF18', onClick: () => navigate("/ghq12-test") }
  ];


  return (
    <div className={`dashboard ${sidebarOpen ? "sidebar-open" : "sidebar-closed"}`}>
      <Navbar
        selectedLanguage={selectedLanguage}
        handleLanguageChange={handleLanguageChange}
        handleLogout={handleLogout}
      />

      <div className="dashboard-body">
        {/* <Sidebar isOpen={sidebarOpen} /> */}

        <main className="dashboard-main">
        <div className="top-section">
          <div className="welcome-text">
            <h2>{`${t('dashboard.welcome_user')}, ${(JSON.parse(localStorage.getItem("user"))).name || "User"}!`}</h2>
          </div>

          <img className="std-dash-img" src={heroImg} alt="image" />

          {/* Add BookNowCard */}
          <div className="book-now-wrapper">
            <BookNowCard />
          </div>
        </div>

          <div className="dashboard-content">
            <div className="mid-section">
              <MoodCard />
              <ChatPrompt />
            </div>
            

            <div className="modules-grid" >
              
              {modules.map((module, index) => (
                <ModuleCard
                  key={index}
                  title={module.title}
                  icon={module.icon}
                  color={module.color}
                  onClick={module.onClick}
                />
              ))}
            </div>

              <div className="bottom-section">
                <ExploreSection />
                <ResourceHub />
              </div>
            
          </div>
        </main>

        {/* <aside className="dashboard-right">
          <Schedule />
          <WellnessTasks />
        </aside> */}
      </div>
    </div>
  );
};

export default Dashboard;
