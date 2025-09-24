import React from "react";
import ModuleCard from "../../components/ModuleCard/ModuleCard";
import "./ResourceHub.css";
import calmingMusicImg from "../../assets/calming_music.png";
import selfHelpImg from "../../assets/self_help_videos.jpg";
import { useTranslation } from 'react-i18next';
import { t } from 'i18next';


const ResourceHub = () => {
  return (
  
    <section className="resource-hub">
      <h2>{t('dashboard.resource_hub')}</h2>
      <div className="resource-grid">
        <div
          className="card self-help"
          // onClick={() => navigate("/wellness-forest")}
        >
          <img src={selfHelpImg} alt="Self Help" className="self-help-img" />
          <p>{t('dashboard.self_help_videos')}</p>
        </div>
        <div className="card music">
          <img src={calmingMusicImg} alt="Gaming Zone" className="card-music-img" />
          <p>{t('dashboard.calming_music')}</p>
        </div>
      </div>
    </section>
  );
};

export default ResourceHub;
