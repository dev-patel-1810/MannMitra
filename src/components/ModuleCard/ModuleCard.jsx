// ModuleCard.jsx
import React from "react";
import "./ModuleCard.css";

const ModuleCard = ({ title, className, onClick }) => {
  return (
    <div className={`module-card ${className}`} onClick={onClick}>
      <h3>{title}</h3>
    </div>
  );
};

export default ModuleCard;
