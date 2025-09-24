import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from 'react-i18next';
import { t } from 'i18next';

// External components (kept as-is since they exist in your project)
import MoodCard from "../../components/MoodCard/MoodCard";
import ChatPrompt from "../../components/ChatPrompt/ChatPrompt";
import ModuleCard from "../../components/ModuleCard/ModuleCard";
import ExploreSection from "../../components/ExploreSection/ExploreSection";
import ResourceHub from "../../components/ResourceHub/ResourceHub";
import Schedule from "../../components/Schedule/Schedule";
import WellnessTasks from "../../components/WellnessTasks/WellnessTasks";

// Import module icons
import peerIcon from '../../assets/peer_group.jpg';
import counselorIcon from '../../assets/your_counsellor.jpg';
import analyticsIcon from '../../assets/analytics.jpg';
import testIcon from '../../assets/take_test.jpg';

import "./Dash_student.css";

// ================= NAVBAR =================
const Navbar = ({ toggleSidebar, selectedLanguage, handleLanguageChange }) => {
  const userName = localStorage.getItem("userName") || "User";

  return (
    <nav className="navbar">
      <button className="hamburger" onClick={toggleSidebar}>☰</button>
      <h1 className="navbar-title">{t('dashboard.dashboard')}</h1>

      <div className="nav-right">
        <select
          className="language-select-student"
          value={selectedLanguage}
          onChange={handleLanguageChange}
        >
          <option value="en">English</option>
          <option value="hi">Hindi</option>
          <option value="doi">Dogri</option>
        </select>
      </div>
    </nav>
  );
};

// ================= SIDEBAR =================
const Sidebar = ({ isOpen }) => {
  const navigate = useNavigate();

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

  const modules = [
    { title: t('dashboard.peer'), icon: peerIcon, color: '#B63C65' },
    { title: t('modal.counsellorTitle'), icon: counselorIcon, color: '#2653A0' },
    { title: t('dashboard.analytics'), icon: analyticsIcon, color: '#54BABE' },
    { title: t('dashboard.take_test'), icon: testIcon, color: '#FAAF18', onClick: () => navigate("/ghq12-test") }
  ];

  return (
    <div className={`dashboard ${sidebarOpen ? "sidebar-open" : "sidebar-closed"}`}>
      <Navbar
        toggleSidebar={() => setSidebarOpen(!sidebarOpen)}
        selectedLanguage={selectedLanguage}
        handleLanguageChange={handleLanguageChange}
      />

      <div className="dashboard-body">
        <Sidebar isOpen={sidebarOpen} />

        <main className="dashboard-main">
          <div className="hero-section">
            <div className="welcome-text">
              <h2>{`${t('dashboard.welcome_user')}, ${localStorage.getItem("userName") || "User"}!`}</h2>
            </div>
            <div className="hero-image"></div>
          </div>

          <div className="dashboard-content">
            <MoodCard />
            <ChatPrompt />

            <div className="modules-grid">
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

            <ExploreSection />
            <ResourceHub />
          </div>
        </main>

        <aside className="dashboard-right">
          <Schedule />
          <WellnessTasks />
        </aside>
      </div>
    </div>
  );
};

export default Dashboard;
