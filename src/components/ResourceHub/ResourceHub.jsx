import React from "react";
import ModuleCard from "../../components/ModuleCard/ModuleCard";
import "./ResourceHub.css";
// ✅ import the images
import calmingMusicImg from "../../assets/calming_music.png";
import selfHelpImg from "../../assets/self_help_videos.jpg";

const ResourceHub = () => {
  return (
    <div className="resource-hub">
      <div className="resource-grid">
        <ModuleCard 
          image={selfHelpImg} 
          title="Self-Help Videos" 
          className="card"
        />
        <ModuleCard 
          image={calmingMusicImg} 
          title="Calming Music" 
          className="card"
        />
      </div>
    </div>
  );
};

export default ResourceHub;
