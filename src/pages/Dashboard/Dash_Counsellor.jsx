import React, { useState, useEffect } from 'react';
import AppointmentsList from '../../components/AppointmentList/AppointmentList.jsx';
import { useTranslation } from 'react-i18next';
import './Dash_Counsellor.css';



const Dash_Counsellor = () => {
  const { t, i18n } = useTranslation();

  const [selectedLanguage, setSelectedLanguage] = useState(() => {
    const storedLang = localStorage.getItem('appLanguage');
    return storedLang || 'en'; // Force localStorage first
  });

  useEffect(() => {
    // Make sure i18n always uses localStorage or 'en'
    i18n.changeLanguage(selectedLanguage);
    localStorage.setItem('appLanguage', selectedLanguage);
  }, [i18n, selectedLanguage]);

  const handleLanguageChange = (event) => {
    const lang = event.target.value;
    setSelectedLanguage(lang);
  };
  return (
    <div>
      {/* Language dropdown at the true top right of dashboard */}
      <div className="dashboard-lang-select">
        <select
          className="language-select"
          value={selectedLanguage}
          onChange={handleLanguageChange}
        >
          <option value="en">English</option>
          <option value="hi">Hindi</option>
          <option value="doi">Dogri</option>
        </select>
      </div>
      <AppointmentsList userType="counsellor" />
    </div>
    
  );
}

export default Dash_Counsellor;
