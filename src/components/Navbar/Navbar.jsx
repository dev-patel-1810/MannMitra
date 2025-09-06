import React from 'react';
import './Navbar.css';

const Navbar = () => {
  return (
    <nav className="navbar">
      <div className="logo">Mann Mitra</div>
      <div className="nav-buttons">
        <button className="language-btn">Language</button>
        <button className="signin-btn">Sign In</button>
      </div>
    </nav>
  );
};

export default Navbar;
