import React, { useState } from 'react';
import Modal from '../Modal/Modal';
import './Hero.css';
import logo from '../../assets/logo.jpg'
const Hero = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const options = [
    'Student Sign Up',
    'Counsellor Sign Up',
    'Register University'
  ];

  return (
    <section className="hero">
      <div className="hero-content">
        <div className="header-row">
          <div className="logo">
            <img src={logo} alt='Logo'/>
            <h3>MannMitra</h3>
          </div>
          <div className="header-buttons">
            <button className="language-btn">EN</button>
            <button className="signin-btn">Sign In</button>
          </div>
        </div>
        <div className="hero-text">
          <h1>
            <span className="orange-text">YOUR</span> JOURNEY TO EMOTIONAL WELLNESS
          </h1>
          <p>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod
            tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim
            veniam, quis nostrud exercitation
          </p>
          <button onClick={() => setIsModalOpen(true)}>GET STARTED</button>
        </div>
      </div>
      <div className="hero-image"></div>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        options={options}
      />
    </section>
  );
};

export default Hero;


