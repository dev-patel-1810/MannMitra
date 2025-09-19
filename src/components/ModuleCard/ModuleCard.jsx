import React from 'react';
import './ModuleCard.css';

const ModuleCard = ({ title, icon, image, color, onClick }) => {
  return (
    <div className="module-card" style={{ backgroundColor: color }} onClick={onClick}>
      <div className="module-content">
        <div className="icon-container">
          <img src={icon || image} alt={title} className="module-icon" />
        </div>
        <div className="title-container">
          <h3>{title}</h3>
        </div>
      </div>
    </div>
  );
};

export default ModuleCard;
