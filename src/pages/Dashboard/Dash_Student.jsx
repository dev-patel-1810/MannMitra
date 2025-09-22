import React, { useState, useEffect } from "react";
import Navbar from "../../components/Navbar/Navbar";
import Sidebar from "../../components/Sidebar/Sidebar";
import MoodCard from "../../components/MoodCard/MoodCard";
import ChatPrompt from "../../components/ChatPrompt/ChatPrompt";
import ModuleCard from "../../components/ModuleCard/ModuleCard";
import ExploreSection from "../../components/ExploreSection/ExploreSection";
import ResourceHub from "../../components/ResourceHub/ResourceHub";
import Schedule from "../../components/Schedule/Schedule";
import WellnessTasks from "../../components/WellnessTasks/WellnessTasks";
import { useNavigate } from "react-router-dom";
import { useTranslation} from 'react-i18next';
import { t } from 'i18next';

function About() {
  const { t } = useTranslation();
}



// Import module icons
import peerIcon from '../../assets/peer_group.jpg';
import counselorIcon from '../../assets/your_counsellor.jpg';
import analyticsIcon from '../../assets/analytics.jpg';
import testIcon from '../../assets/take_test.jpg';

import "./Dash_Student.css";

const Dash_Student = () => {
  const { t, i18n } = useTranslation();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [selectedLanguage, setSelectedLanguage] = useState(() => {
    return localStorage.getItem('appLanguage') || i18n.language || 'en';
  });
  const navigate = useNavigate();

  useEffect(() => {
    const storedLang = localStorage.getItem('appLanguage');
    if (storedLang && storedLang !== i18n.language) {
      i18n.changeLanguage(storedLang);
    }
  }, [i18n]);

  const handleLanguageChange = (event) => {
    const lang = event.target.value;
    setSelectedLanguage(lang);
    i18n.changeLanguage(lang);
    localStorage.setItem('appLanguage', lang);
  };

  const modules = [
    { title: t('dashboard.peer'), icon: peerIcon, color: '#B63C65' },
    { title: t('modal.counsellorTitle'), icon: counselorIcon, color: '#2653A0' },
    { title: t('dashboard.analytics'), icon: analyticsIcon, color: '#54BABE' },
    { title: t('dashboard.take_test'), icon: testIcon, color: '#FAAF18', onClick: () => navigate("/ghq12-test") }
  ];

  return (
    <div className={`dashboard ${sidebarOpen ? "sidebar-open" : "sidebar-closed"}`}> 
      {/* Language dropdown at the true top right of dashboard */}
      <div className="dashboard-lang-select">
        <select
          className="language-select"
          value={selectedLanguage}
          onChange={handleLanguageChange}
        >
          <option value="en">English</option>
          <option value="hi">Hindi</option>
        </select>
      </div>
      <Navbar toggleSidebar={() => setSidebarOpen(!sidebarOpen)} />

      <div className="dashboard-body">
        <Sidebar isOpen={sidebarOpen} />

        <main className="dashboard-main">
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

export default Dash_Student;
