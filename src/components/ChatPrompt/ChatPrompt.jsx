import React from 'react';
import './ChatPrompt.css';
import ChatPen from '../../assets/ChatPenguin.png';
import { useTranslation } from 'react-i18next';
import { t } from 'i18next';

function About() {
  const { t } = useTranslation();
}



const ChatPrompt = () => {
  return (
    <div className="chat-prompt">
      <div className="chat-content">
        <div className="chat-text">
          <h3>{t('dashboard.lets_talk')}</h3>
          <p>{t('dashboard.lets_talk2')}</p>
          <button className="chat-btn">{t('dashboard.chat')}</button>
        </div>
        <div className="chat-image">
          <img src={ChatPen} alt="Chat Character" />
        </div>
      </div>
    </div>
  );
};

export default ChatPrompt;
