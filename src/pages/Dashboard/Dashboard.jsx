import React, { useState, useEffect } from 'react';
import './Dashboard.css';
import MoodCard from '../../components/MoodCard/MoodCard';
import ChatPrompt from '../../components/ChatPrompt/ChatPrompt';
import ModuleCard from '../../components/ModuleCard/ModuleCard';
import peerIcon from '../../assets/peer group.png';
import counselorIcon from '../../assets/counsellor.png';
import analyticsIcon from '../../assets/analytics.png';
import testIcon from '../../assets/take test.png';
import profile1 from '../../assets/profile1.png';
import profile2 from '../../assets/profile2.png';
import profile3 from '../../assets/profile3.png';
import { useTranslation } from 'react-i18next';

function About() {
  const { t } = useTranslation();
}


const Dashboard = () => {
  const { t, i18n } = useTranslation();

  const [selectedLanguage, setSelectedLanguage] = useState(() => {
    const storedLang = localStorage.getItem('appLanguage');
    return storedLang || 'en'; // always default to localStorage first, then 'en'
  });

  // Sync i18n and localStorage whenever selectedLanguage changes
  useEffect(() => {
    i18n.changeLanguage(selectedLanguage);
    localStorage.setItem('appLanguage', selectedLanguage);
  }, [i18n, selectedLanguage]);

  const handleLanguageChange = (event) => {
    const lang = event.target.value;
    setSelectedLanguage(lang); // triggers useEffect to update i18n & localStorage
  };

  const modules = [
    { title: t('dashboard.peer'), icon: peerIcon, color: '#B63C65' },
    { title: t('modal.counsellorTitle'), icon: counselorIcon, color: '#2653A0' },
    { title: t('dashboard.analytics'), icon: analyticsIcon, color: '#54BABE' },
    { title: t('dashboard.take_test'), icon: testIcon, color: '#FAAF18' }
  ];

  const wellnessTasks = [
    { id: 1, task: t('dashboard.daily_mood'), completed: true, image: profile1 },
    { id: 2, task: t('dashboard.join_peer'), completed: false, image: profile2 },
    { id: 3, task: t('dashboard.schedule_session'), completed: false, image: profile3 }
  ];

  return (
    <div className="dashboard">
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
            />
          ))}
        </div>
        <div className="wellness-tasks">
          <h2>{t('dashboard.wellness_task')}</h2>
          <div className="tasks-list">
            {wellnessTasks.map(task => (
              <div key={task.id} className="task-item">
                <div className="task-info">
                  <img src={task.image} alt="Profile" className="task-profile" />
                  <span className="task-text">{task.task}</span>
                </div>
                <div className="task-status">
                  <input
                    type="checkbox"
                    checked={task.completed}
                    readOnly
                    className="task-checkbox"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;