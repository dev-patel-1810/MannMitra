
import React from 'react';
import Hero from '../../components/Hero/Hero';
import Features from '../../components/Features/Features';
import Footer from '../../components/Footer/Footer';
import './LandingPage.css';
import '../../i18n';


const LandingPage = () => {
  return (
    <div className="landing-page">
      <Hero />
      <Features />
      <Footer />
    </div>
  );
};

export default LandingPage;