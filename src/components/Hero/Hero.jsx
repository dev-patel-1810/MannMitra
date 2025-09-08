import React, { useState } from 'react';
import Modal from '../Modal/Modal';
import './Hero.css';
import logo from '../../assets/logo.jpg'
import heroImg from '../../assets/hero.png'; 
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
            <button className="language-btn">English<span class="material-symbols-outlined">keyboard_arrow_down</span></button>
            <button className="signin-btn" >Login</button>
          </div>
        </div>
        <div className="hero-text">
          <h1>
            <span className="orange-text">YOUR</span> <span className='blue-text'>JOURNEY TO EMOTIONAL WELLNESS</span> 
          </h1>
          <p>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod
            tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim
            veniam, quis nostrud exercitation
          </p>
          <button className="get-started-btn" onClick={() => setIsModalOpen(true)}>GET STARTED</button>
        </div>
      </div>
      
      <div className="hero-image-wrapper">
        <img src={heroImg} alt="Hero" className="hero-image" />
      </div>
      
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        options={options}
      />
    </section>
  );
};

export default Hero;


