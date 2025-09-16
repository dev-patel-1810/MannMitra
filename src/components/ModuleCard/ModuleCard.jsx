import React from "react";
import "./ModuleCard.css";


const ModuleCard = ({ title, className }) => {
  return (
    <div className={`module-card ${className || ""}`}>
      <h3>{title}</h3>
    </div>
  );
};
export default ModuleCard;