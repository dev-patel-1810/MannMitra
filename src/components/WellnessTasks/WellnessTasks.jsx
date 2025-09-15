import React from "react";
import "./WellnessTasks.css";

const WellnessTasks = () => {
  return (
    <div className="card wellness-tasks">
      <h2>Wellness Tasks</h2>
      <ul>
        <li>Task 1 ✅</li>
        <li>Task 2 ⏳</li>
        <li>Task 3 ❌</li>
      </ul>
    </div>
  );
};

export default WellnessTasks;
