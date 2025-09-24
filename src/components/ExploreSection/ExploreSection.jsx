import React from "react";
import "./ExploreSection.css";
import { useNavigate } from "react-router-dom";

// Import images
import wellnessImg from "../../assets/wellness_Task1.png";
import gamingImg from "../../assets/Gaming_zone.png";
import { useTranslation } from 'react-i18next';
import { t } from 'i18next';

function About() {
  const { t } = useTranslation();
}

const ExploreSection = () => {

  const navigate = useNavigate();

  return (
    <section className="explore-section">
      <h2>{t('dashboard.explore')}</h2>
      <div className="explore-grid">
        <div
          className="card clickable"
          onClick={() => navigate("/wellness-forest")}
        >
          <img src={wellnessImg} alt="Wellness Tasks" className="card-img" />
          <p>{t('dashboard.wellness_tasks')}</p>
        </div>
        <div className="card gaming">
          <img src={gamingImg} alt="Gaming Zone" className="card-img" />
          <p>{t('dashboard.gaming_zone')}</p>
        </div>
      </div>
    </section>
  );
};

export default ExploreSection;
