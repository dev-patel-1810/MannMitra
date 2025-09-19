import React from 'react';
import './ModuleCard.css';

const ModuleCard = ({ title, icon, image, color }) => {
  return (
    <div className="module-card" style={{ backgroundColor: color }}>
      <div className="module-content">
        <img src={icon || image} alt={title} className="module-icon" />
        <h3>{title}</h3>
      </div>
    </div>
  );
};

export default ModuleCard;
