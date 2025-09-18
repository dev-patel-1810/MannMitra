// ModuleCard.jsx
import React from "react";
import "./ModuleCard.css";

const ModuleCard = ({ title, className,image, onClick }) => {
  return (
    <div className={`module-card ${className}`} onClick={onClick}>
      {image && <img src={image} alt={title} className="module-image" />}
      <h3>{title}</h3>
    </div>
  );
};

export default ModuleCard;
