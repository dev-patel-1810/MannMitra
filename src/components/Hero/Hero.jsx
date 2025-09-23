
import React, { useState } from 'react';
import Modal from '../Modal/Modal';
import './Hero.css';
import logo from '../../assets/logo.jpg';
import heroImg from '../../assets/hero.png';
import Vector from "../../assets/Vector.svg";
import { useNavigate } from "react-router-dom";
import { useTranslation } from 'react-i18next';


const Hero = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { t, i18n } = useTranslation();
  const [selectedLanguage, setSelectedLanguage] = useState(i18n.language || 'en');

  const navigate = useNavigate();

  const handleLanguageChange = (event) => {
    const lang = event.target.value;
    setSelectedLanguage(lang);
    i18n.changeLanguage(lang);
  };

  const handleLogin = () => {
    navigate('/login');
  };

  // const options = [
  //   'Student Sign Up',
  //   'Counsellor Sign Up',
  //   'Register University'
  // ];

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
          <div className="language-select-wrapper">
            <select
              className="language-select"
              value={selectedLanguage}
              onChange={handleLanguageChange}
            >
              <option value="en">English</option>
              <option value="hi">Hindi</option>
              <option value="doi">Dogri</option>
            </select>
            <span className="material-symbols-outlined">arrow_drop_down</span>
          </div>

            <button onClick={handleLogin} className="signin-btn" >{t('common.login')}</button>
          </div>
        </div>
        <div className="hero-text">
          <h1>
            <span className="orange-text">{t('hero.your')}</span> <span className='blue-text'>{t('hero.journey')}</span>
          </h1>
          <p>{t('hero.description')}</p>
          <button className="get-started-btn" onClick={() => setIsModalOpen(true)}>{t('hero.getStarted')}</button>
        </div>
      </div>

        <img src={heroImg} alt="Hero" className="hero-image" />
        
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </section>
  );
};

export default Hero;


