import React from "react";
import "./ModuleCard.css";

const ModuleCard = ({ title }) => {
  return (
    <div className="card module-card">
      <h3>{title}</h3>
    </div>
  );
};

export default ModuleCard;
