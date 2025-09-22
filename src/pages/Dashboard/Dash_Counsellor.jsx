import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import AppointmentsList from '../../components/AppointmentList/AppointmentList';
import './Dash_Counsellor.css';

function About() {
  const { t } = useTranslation();
}

const Dash_Counsellor = () => {
  const { t, i18n } = useTranslation();
  const [selectedLanguage, setSelectedLanguage] = useState(() => {
    return localStorage.getItem('appLanguage') || i18n.language || 'en';
  });

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
        </select>
      </div>
      <AppointmentsList userType={t('modal.counsellorTitle')} />
    </div>
  );
}

export default Dash_Counsellor;
