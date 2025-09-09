import React, { useState } from 'react';
import Modal from '../Modal/Modal';
import './Hero.css';
import logo from '../../assets/logo.jpg'
import heroImg from '../../assets/hero.png'; 
import Vector from "../../assets/Vector.svg";

const Hero = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const options = [
    'Student Sign Up',
    'Counsellor Sign Up',
    'Register University'
  ];

  return (
    <section className="hero">
      {/* Add decorative SVGs */}
      <div className="background-svgs">
      <img
        src={Vector}
        alt="background vector"
        className="absolute inset-0 w-full h-full object-cover"
      />
      </div>
      <div className="hero-content">
        <div className="header-row">
          <div className="logo">
            <img src={logo} alt='Logo'/>
            <h3>MannMitra</h3>
          </div>
          <div className="header-buttons">
            <button className="language-btn">English<span className="material-symbols-outlined">keyboard_arrow_down</span></button>
            <button className="signin-btn" >Login</button>
          </div>
        </div>
        <div className="hero-text">
          <h1>
            <span className="orange-text">YOUR</span> <span className='blue-text'>JOURNEY TO EMOTIONAL WELLNESS</span> 
          </h1>
          <p>
              Life isn’t always sunshine and rainbows. Some days feel heavy, and that’s okay.
              MannMitra is here to be your buddy — a space to chill, vent, and find little ways to feel lighter.
              Ready to take that first step toward feeling good again?
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


