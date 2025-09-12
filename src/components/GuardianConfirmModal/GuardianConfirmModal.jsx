import { useState, useEffect } from 'react';
import './GuardianConfirmModal.css';

const GuardianConfirmModal = ({ isOpen, onClose, onConfirm }) => {
  const [timer, setTimer] = useState(10);
  const [isChecked, setIsChecked] = useState(false);

  useEffect(() => {
    let interval;
    if (isOpen && timer > 0) {
      interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isOpen, timer]);

  useEffect(() => {
    if (isOpen) {
      setTimer(10);
      setIsChecked(false);
    }
  }, [isOpen]);

  const handleAccept = () => {
    if (timer === 0 || isChecked) {
      onConfirm();
    }
  };

  const handleCheckboxChange = (e) => {
    setIsChecked(e.target.checked);
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>DISCLAIMER</h2>
        <div className="modal-body">
          <p className="warning-text">No guardian information added !</p>
          <p className="info-text">
            In case you ever press SOS, we'll directly connect you to the suicide 
            prevention helpline, emergency number 112, and your campus 
            counselor to make sure you get immediate support.
          </p>
          <label className="checkbox-container">
            <input 
              type="checkbox" 
              checked={isChecked}
              onChange={handleCheckboxChange}
            />
            <span className="checkbox-text">
              I have read the above disclaimer and I willingly choose to have no guardian's contact.
            </span>
          </label>
        </div>
        <div className="modal-actions">
          <button 
            className="accept-btn" 
            disabled={timer > 0 && !isChecked}
            onClick={handleAccept}
          >
            Accept {timer > 0 && !isChecked ? `(${timer}s)` : ''}
          </button>
          <button className="decline-btn" onClick={onClose}>
            Decline
          </button>
        </div>
      </div>
    </div>
  );
};

export default GuardianConfirmModal;