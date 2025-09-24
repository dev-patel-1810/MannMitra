import React from 'react';
import { useNavigate } from "react-router-dom";
import { useTranslation } from 'react-i18next';

import './BookNowCard.css'; // new CSS file for styling

import appointmentImg from '../../assets/appointment_book.jpg'; // <-- Import the image

const BookNowCard = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const handleBookNow = () => {
    navigate("/appointment");
  };

  return (
    <div className="book-now-card">
      <h2>{t('dashboard.book_appointments')}</h2>
      {/* <p>{t('dashboard.book_now_description') }</p> */}
      <img src={appointmentImg} alt="Book Appointment" className="book-now-img" />
      <button className="book-now-btn" onClick={handleBookNow}>
        {t('dashboard.book_now')}
      </button>
    </div>
  );
};

export default BookNowCard;
