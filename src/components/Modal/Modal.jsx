import React from 'react';
import { useNavigate } from 'react-router-dom';
import './Modal.css';

const Modal = ({ isOpen, onClose, options }) => {
  const navigate = useNavigate();

  if (!isOpen) return null;

  const optionDescriptions = [
    "For students seeking mental health support.",
    "For counselors to guide and help students.",
    "For universities to support student wellbeing."
  ];

  // Map option buttons to routes
  const optionRoutes = [
    "/user-signup",       // Student Sign Up → User Sign-Up page
    "/counsellor-signup",
    "/college-signup"
  ];

  const handleClick = (index) => {
    navigate(optionRoutes[index]); // Navigate to the correct page
    onClose(); // Close modal
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <h2>Get Started</h2>
        <div className="modal-options">
          {options.map((option, index) => (
            <div key={index} className="modal-option">
              <button onClick={() => handleClick(index)}>
                {option}
              </button>
              <p className="option-description">{optionDescriptions[index]}</p>
            </div>
          ))}
        </div>
        <button className="modal-close" onClick={onClose}>
          ×
        </button>
      </div>
    </div>
  );
};

export default Modal;
