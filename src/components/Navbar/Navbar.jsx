import React from "react";
import "./Navbar.css";
import dashboardImage from "../../assets/dashboard_image.png";

const Navbar = ({ toggleSidebar }) => {
  return (
    <nav className="navbar">
      <button className="hamburger" onClick={toggleSidebar}>
        ☰
      </button>
      <h1 className="navbar-title">Dashboard</h1>
      <div className="hero-section">
        <div className="welcome-text">
          <h2>Welcome Back, Username!</h2>
        </div>
        <div className="hero-image">
          <img src={dashboardImage} alt="Dashboard illustration" />
        </div>
      </div>
      <div className="navbar-profile">Profile</div>
    </nav>
  );
};

export default Navbar;
