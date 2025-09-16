
import React from "react";
import { useNavigate } from "react-router-dom";
import { FaGoogle, FaFacebook, FaTimes } from "react-icons/fa";
import './Modal.css';
import { useTranslation } from 'react-i18next';


const Modal = ({ isOpen, onClose }) => {
  const navigate = useNavigate();
  const { t } = useTranslation();

  if (!isOpen) return null;

  const cards = [
    {
      title: t('modal.studentTitle'),
      color: "bg-pink-600",
      text: t('modal.studentText'),
      features: [
        t('modal.studentFeature1'),
        t('modal.studentFeature2'),
        t('modal.studentFeature3'),
        t('modal.studentFeature4'),
        t('modal.studentFeature5'),
        t('modal.studentFeature6'),
      ],
      route: "/user-signup",
    },
    {
      title: t('modal.counsellorTitle'),
      color: "bg-blue-700",
      text: t('modal.counsellorText'),
      features: [
        t('modal.counsellorFeature1'),
        t('modal.counsellorFeature2'),
        t('modal.counsellorFeature3'),
        t('modal.counsellorFeature4'),
        t('modal.counsellorFeature5'),
      ],
      route: "/counsellor-signup",
    },
    {
      title: t('modal.universityTitle'),
      color: "bg-orange-600",
      text: t('modal.universityText'),
      features: [
        t('modal.universityFeature1'),
        t('modal.universityFeature2'),
        t('modal.universityFeature3'),
        t('modal.universityFeature4'),
        t('modal.universityFeature5'),
      ],
      route: "/college-signup",
    },
  ];

  const handleClick = (route) => {
    navigate(route);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/10 flex items-center justify-center z-50">
  <div className="modal-container">
    {/* Close Button */}
    <button onClick={onClose} className="modal-close">
      <span className="material-symbols-outlined">close</span>
    </button>

    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-end">
      {cards.map((card, idx) => (
        <div
          key={idx}
          className={`modal-card 
            ${idx === 0 ? 'student' : idx === 1 ? 'counselor middle' : 'university'}`}
        >
          <div className="card-header">{card.title}</div>
          <div className="card-content text-xs">
            <p className="mb-4">{card.text}</p>
            <ul className="text-sm">
              {card.features.map((feature, i) => (
                <li key={i} className="flex items-center gap-2">
                  <svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="18" height="18" viewBox="0 0 48 48">
<path fill="#4caf50" d="M44,24c0,11.045-8.955,20-20,20S4,35.045,4,24S12.955,4,24,4S44,12.955,44,24z"></path><path fill="#ccff90" d="M34.602,14.602L21,28.199l-5.602-5.598l-2.797,2.797L21,33.801l16.398-16.402L34.602,14.602z"></path>
</svg> <span>{feature}</span>
                </li>
              ))}
            </ul>
            <div className="mt-6 flex flex-col items-center">
              <button
                onClick={() => handleClick(card.route)}
                className="signup-btn"
              >
                {t('modal.signup')}
              </button>
              <hr className="divider" />
              <p className="login-text">{t('modal.orLoginWith')}</p>
              <div className="flex gap-4 mt-2">
                <svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="30" height="30" viewBox="0 0 48 48">
                  <path fill="#FFC107" d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12c0-6.627,5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24c0,11.045,8.955,20,20,20c11.045,0,20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z"></path><path fill="#FF3D00" d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z"></path><path fill="#4CAF50" d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z"></path><path fill="#1976D2" d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571c0.001-0.001,0.002-0.001,0.003-0.002l6.19,5.238C36.971,39.205,44,34,44,24C44,22.659,43.862,21.35,43.611,20.083z"></path>
                </svg>
                <svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="33" height="33" viewBox="0 0 48 48">
                  <path fill="#039be5" d="M24 5A19 19 0 1 0 24 43A19 19 0 1 0 24 5Z"></path><path fill="#fff" d="M26.572,29.036h4.917l0.772-4.995h-5.69v-2.73c0-2.075,0.678-3.915,2.619-3.915h3.119v-4.359c-0.548-0.074-1.707-0.236-3.897-0.236c-4.573,0-7.254,2.415-7.254,7.917v3.323h-4.701v4.995h4.701v13.729C22.089,42.905,23.032,43,24,43c0.875,0,1.729-0.08,2.572-0.194V29.036z"></path>
                </svg>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  </div>
</div>

  );
};

export default Modal;
