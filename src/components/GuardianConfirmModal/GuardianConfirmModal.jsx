import { useState, useEffect } from 'react';
import './GuardianConfirmModal.css';
import { useTranslation } from 'react-i18next';

const GuardianConfirmModal = ({ isOpen, onClose, onConfirm }) => {
  const { t } = useTranslation();
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
          <p className="warning-text">{(t('common.no_guardian_info'))}</p>
          <p className="info-text">
            {t('common.guardian_confirm_info')}
          </p>
          <label className="checkbox-container">
            <input 
              type="checkbox" 
              checked={isChecked}
              onChange={handleCheckboxChange}
            />
            <span className="checkbox-text">
              {t('common.guardian_confirm_checkbox')}
            </span>
          </label>
        </div>
        <div className="modal-actions">
          <button 
            className="accept-btn" 
            disabled={timer > 0 && !isChecked}
            onClick={handleAccept}
          >
            {t('common.accept')} {timer > 0 && !isChecked ? `(${timer}s)` : ''}
          </button>
          <button className="decline-btn" onClick={onClose}>
            {t('common.decline')}
          </button>
        </div>
      </div>
    </div>
  );
};

export default GuardianConfirmModal;