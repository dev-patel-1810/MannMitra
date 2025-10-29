import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import AppointmentList from '../../components/AppointmentList/AppointmentList';
import Sidebar from '../../components/Sidebar_counsellor_dash/Sidebar';
import './Dash_Counsellor.css';

const Dash_Counsellor = () => {
  const { t } = useTranslation();
  const [selectedLanguage, setSelectedLanguage] = useState('en');

  const handleLanguageChange = (e) => {
    setSelectedLanguage(e.target.value);
  };

  return (
    <div className="dashboard-container">
      <Sidebar />
      <div className="counsellor-dashboard">
        <div className="dashboard-header">
          <h1>Dashboard</h1>
          <select 
            value={selectedLanguage}
            onChange={handleLanguageChange}
            className="language-select-counsellor"
          >
            <option value="en">English</option>
            <option value="hi">हिंदी</option>
            <option value="doi">डोगरी</option>
          </select>
        </div>

        <div className="appointments-section">
          
          <AppointmentList userType="counsellor" />
        </div>

        <div className="stats-grid">
          <div className="stat-card pink">
            <div className="stat-icon">👥</div>
            <div className="stat-content">
              <div className="stat-number">347</div>
              <div className="stat-label">Students</div>
            </div>
          </div>
          <div className="stat-card green">
            <div className="stat-icon">⏱️</div>
            <div className="stat-content">
              <div className="stat-number">1300</div>
              <div className="stat-label">Minutes spent with students</div>
            </div>
          </div>
          <div className="stat-card blue">
            <div className="stat-icon">📈</div>
            <div className="stat-content">
              <div className="stat-number">84%</div>
              <div className="stat-label">Success Rate</div>
            </div>
          </div>
          <div className="stat-card yellow">
            <div className="stat-icon">📝</div>
            <div className="stat-content">
              <div className="stat-number">34</div>
              <div className="stat-label">Tests Reviewed</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dash_Counsellor;
