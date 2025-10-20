import React, { useState, useRef, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import './ChatBot.css';
import ChatPen from '../../assets/ChatPenguin.png';

const ChatBot = () => {
  const { t } = useTranslation();

  const [messages, setMessages] = useState([
    {
      type: 'bot',
      content: t('chatbot.welcome_message'),
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const chatContainerRef = useRef(null);

  // Auto-scroll to bottom when new message appears
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  // Handle send
  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage = {
      type: 'user',
      content: input,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsTyping(true);

    setTimeout(async () => {
      const botResponse = await getBotResponse(input);
      setMessages((prev) => [
        ...prev,
        {
          type: 'bot',
          content: botResponse,
          timestamp: new Date(),
        },
      ]);
      setIsTyping(false);
    }, 900);
  };

  // ✨ Enhanced NLP-style response logic
  const getBotResponse = async (userInput) => {
    const input = userInput.toLowerCase();

    const responses = {
      anxiety: t('chatbot.anxiety_response'),
      anxious: t('chatbot.anxiety_response'),
      depression: t('chatbot.depression_response'),
      stress: t('chatbot.stress_response'),
      help: t('chatbot.help_response'),
      greeting: t('chatbot.greeting_response'),
      gratitude: t('chatbot.gratitude_response'),
      goodbye: t('chatbot.goodbye_response'),
      positivity: t('chatbot.positive_response'), // 🌞 new category
      general: t('chatbot.general_response'),
    };

    const match = (keywords) => keywords.some((k) => input.includes(k));

    if (match(['hi', 'hello', 'hey', 'good morning', 'good evening'])) return responses.greeting;
    if (match(['thank', 'thanks', 'grateful', 'appreciate'])) return responses.gratitude;
    if (match(['bye', 'goodbye', 'see you', 'take care'])) return responses.goodbye;
    if (match(['anxious', 'anxiety', 'panic', 'nervous'])) return responses.anxiety;
    if (match(['sad', 'depressed', 'low', 'unhappy'])) return responses.depression;
    if (match(['stress', 'tired', 'burnout', 'overwhelmed'])) return responses.stress;
    if (match(['help', 'support', 'advice'])) return responses.help;
    if (match(['happy', 'good', 'great', 'awesome', 'better', 'fine', 'relaxed'])) return responses.positivity; // 🌼 positive case

    return responses.general;
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') handleSend();
  };

  return (
    <div className="chatbot-container">
      <div className="chatbot-header">
        <img src={ChatPen} alt="Chat Assistant" className="chatbot-avatar" />
        <div>
          <h2>{t('chatbot.title')}</h2>
          <p className="chatbot-status">
            🟢 {t('chatbot.online_status')}
          </p>
        </div>
      </div>

      <div className="chat-messages" ref={chatContainerRef}>
        {messages.map((message, index) => (
          <div key={index} className={`message ${message.type}`}>
            {message.type === 'bot' && (
              <img src={ChatPen} alt="Bot" className="message-avatar" />
            )}
            <div className="message-content">
              <p>{message.content}</p>
              <span className="timestamp">
                {message.timestamp.toLocaleTimeString([], {
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </span>
            </div>
          </div>
        ))}

        {isTyping && (
          <div className="message bot typing-indicator">
            <img src={ChatPen} alt="Bot" className="message-avatar" />
            <div className="message-content">
              <p>...</p>
            </div>
          </div>
        )}
      </div>

      <div className="chat-input">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyPress}
          placeholder={t('chatbot.input_placeholder')}
        />
        <button onClick={handleSend}>{t('chatbot.send')}</button>
      </div>
    </div>
  );
};

export default ChatBot;
