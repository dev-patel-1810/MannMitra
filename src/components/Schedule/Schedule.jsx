import React from "react";
import "./Schedule.css";
import {t} from 'i18next';
const Schedule = () => {
  return (
    <div className="card schedule-card">
      <h2>{t('dashboard.schedule')}</h2>
      <ul>
        <li>{t('dashboard.session_1')}</li>
        <li>{t('dashboard.session_2')}</li>
        <li>{t('dashboard.session_3')}</li>
      </ul>
    </div>
  );
};

export default Schedule;
