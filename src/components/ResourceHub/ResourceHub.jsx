import React from "react";
import ModuleCard from "../../components/ModuleCard/ModuleCard";
import "./ResourceHub.css";
import calmingMusicImg from "../../assets/calming_music.png";
import selfHelpImg from "../../assets/self_help_videos.jpg";
import { useTranslation } from 'react-i18next';
import { t } from 'i18next';


const ResourceHub = () => {
  return (
    <div className="resource-hub">
      <div className="resource-grid">
        <ModuleCard 
          image={selfHelpImg} 
          title={t('dashboard.self_help_videos')} 
          className="card"
        />
        <ModuleCard 
          image={calmingMusicImg} 
          title={t('dashboard.calming_music')} 
          className="card"
        />
      </div>
    </div>
  );
};

export default ResourceHub;
