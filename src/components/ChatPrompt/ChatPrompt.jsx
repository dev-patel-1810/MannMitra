import React from 'react';
import { useNavigate } from 'react-router-dom';
import './ChatPrompt.css';
import ChatPen from '../../assets/ChatPenguin.png';
import { useTranslation } from 'react-i18next';

const ChatPrompt = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();

  return (
    <div className="chat-prompt">
      <div className="chat-content">
        <div className="chat-text">
          <h3>{t('dashboard.lets_talk')}</h3>
          <p>{t('dashboard.lets_talk2')}</p>
          <button 
            className="chat-btn"
            onClick={() => navigate('/chat')}
          >
            {t('dashboard.chat')}
          </button>
        </div>
        <div className="chat-image">
          <img src={ChatPen} alt="Chat Character" />
        </div>
      </div>
    </div>
  );
};

export default ChatPrompt;