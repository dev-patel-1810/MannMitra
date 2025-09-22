import React from 'react';
import './MoodCard.css';
import moodMeter from '../../assets/mood track balance.png';
import { useNavigate } from "react-router-dom";
import { useTranslation } from 'react-i18next';
import { t } from 'i18next';

function About() {
  const { t } = useTranslation();
}

const MoodCard = () => {

  const navigate = useNavigate();

  const handleBookNow = () => {
    navigate("/appointment");
  };

  return (
    <div className="mood-card">
      <h2>{t("dashboard.mood")}</h2>
      <div className="mood-content">
        <div className="mood-meter">
          <img src={moodMeter} alt="Mood Meter" />
          <span className="mood-text">{t('dashboard.feeling')}</span>
        </div>
        <div className="appointment-section">
          <p>{t('dashboard.book_appointments')}</p>
          <button className="book-now-btn" onClick={handleBookNow}>{t('dashboard.book_now')}</button>
        </div>
      </div>
    </div>
  );
};

export default MoodCard;
