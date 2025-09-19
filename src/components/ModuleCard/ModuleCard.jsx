import React from "react";
import "./ModuleCard.css";

const ModuleCard = ({ title, icon, image, color, onClick, className }) => {
  const isResourceCard = className === "card";
  
  return (
    <div 
      className={`module-card ${className || ""}`} 
      style={{ backgroundColor: color }} 
      onClick={onClick}
    >
      <div className={`module-content ${isResourceCard ? "resource-content" : ""}`}>
        {isResourceCard ? (
          <>
            <img src={image} alt={title} className="card-img" />
            <h3 className="resource-title">{title}</h3>
          </>
        ) : (
          <>
            <div className="icon-container">
              <img src={icon || image} alt={title} className="module-icon" />
            </div>
            <div className="title-container">
              <h3>{title}</h3>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default ModuleCard;

