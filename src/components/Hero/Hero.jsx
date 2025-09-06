import React, { useState } from 'react';
import Modal from '../Modal/Modal';
import './Hero.css';

const Hero = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const options = [
    'Student Sign Up',
    'Counsellor Sign Up',
    'Register University'
  ];

  return (
    <section className="hero">
      <h1>Your Mental Health Companion</h1>
      <p>Helping you stay mentally strong and connected anytime, anywhere.</p>
      <button onClick={() => setIsModalOpen(true)}>Get Started</button>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        options={options}
      />
    </section>
  );
};

export default Hero;


