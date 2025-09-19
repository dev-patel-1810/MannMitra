import React from 'react';
import './ChatPrompt.css';
import chatCharacter from '../../assets/chat_buddy.png';

const ChatPrompt = () => {
  return (
    <div className="chat-prompt">
      <div className="chat-content">
        <div className="chat-text">
          <h3>Let's Talk!</h3>
          <p>Share your thoughts and feelings with me</p>
          <button className="chat-btn">Chat Now</button>
        </div>
        <div className="chat-image">
          <img src={chatCharacter} alt="Chat Character" />
        </div>
      </div>
    </div>
  );
};

export default ChatPrompt;
