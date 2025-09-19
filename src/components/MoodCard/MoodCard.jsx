import React from 'react';
import './MoodCard.css';
import moodMeter from '../../assets/mood track balance.png';

const MoodCard = () => {
  return (
    <div className="mood-card">
      <h2>How's Your Mood Today?</h2>
      <div className="mood-content">
        <div className="mood-meter">
          <img src={moodMeter} alt="Mood Meter" />
          <span className="mood-text">I Feel Neutral</span>
        </div>
        <div className="appointment-section">
          <p>Book appointment with our counsellor</p>
          <button className="book-now-btn">Book Now!</button>
        </div>
      </div>
    </div>
  );
};

export default MoodCard;
