import React from "react";
import "./ExploreSection.css";
import { useNavigate } from "react-router-dom";

// Import images
import wellnessImg from "../../assets/wellness_task.png";
import gamingImg from "../../assets/Gaming_zone.png";

const ExploreSection = () => {

  const navigate = useNavigate();

  return (
    <section className="explore-section">
      <h2>Explore</h2>
      <div className="explore-grid">
        <div
          className="card clickable"
          onClick={() => navigate("/wellness-forest")}
        >
          <img src={wellnessImg} alt="Wellness Tasks" className="card-img" />
          <p>Wellness Tasks</p>
        </div>
        <div className="card">
          <img src={gamingImg} alt="Gaming Zone" className="card-img" />
          <p>Gaming Zone</p>
        </div>
      </div>
    </section>
  );
};

export default ExploreSection;
