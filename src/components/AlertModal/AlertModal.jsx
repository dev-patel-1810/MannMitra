import React from 'react';
import './AlertModal.css';

const AlertModal = ({ isOpen, onClose, message, title = 'Error', buttonText = 'Close' }) => {
  if (!isOpen) return null;

  return (
    <div className="alert-modal-backdrop">
      <div 
        className="alert-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="alert-modal-title"
      >
        <div className="alert-modal-content">
          
          {/* Icon (Error/Alert) */}
          <div className="alert-modal-icon-container">
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              width="24" 
              height="24" 
              viewBox="0 0 24 24" 
              fill="none" 
              stroke="currentColor" 
              strokeWidth="2" 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              className="alert-modal-icon"
            >
              <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/>
              <path d="M12 9v4"/>
              <path d="M12 17h.01"/>
            </svg>
          </div>

          <h3 id="alert-modal-title" className="alert-modal-title">
            {title}
          </h3>
          
          <p className="alert-modal-message">
            {message}
          </p>
          
          <button
            onClick={onClose}
            className="alert-modal-button"
          >
            {buttonText}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AlertModal;