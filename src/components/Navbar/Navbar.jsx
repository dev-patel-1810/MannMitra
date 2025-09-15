import React from "react";
import "./Navbar.css";

const Navbar = ({ toggleSidebar }) => {
  return (
    <nav className="navbar">
      <button className="hamburger" onClick={toggleSidebar}>
        ☰
      </button>
      <h1 className="navbar-title">Dashboard</h1>
      <div className="navbar-profile">Profile</div>
    </nav>
  );
};

export default Navbar;
