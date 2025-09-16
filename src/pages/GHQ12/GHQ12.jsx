import React, { useState } from 'react';
import logo from '../../assets/logo.jpg';
import { useNavigate } from "react-router-dom";
import './GHQ12.css';

const GHQ12 = () => {
  const [answers, setAnswers] = useState({});
  const [showResults, setShowResults] = useState(false);
  const navigate = useNavigate(); 

  const questions = [
    {
      id: 'q1',
      text: 'Been able to concentrate on what you\'re doing?',
      options: ['Better than usual', 'Same as usual', 'Less than usual', 'Much less than usual']
    },
    {
      id: 'q2',
      text: 'Lost much sleep over worry?',
      options: ['Not at all', 'No more than usual', 'Rather more than usual', 'Much more than usual']
    },
    {
      id: 'q3',
      text: 'Felt that you were playing a useful part in things?',
      options: ['More so than usual', 'Same as usual', 'Less so than usual', 'Much less than usual']
    },
    {
      id: 'q4',
      text: 'Felt capable of making decisions about things?',
      options: ['More so than usual', 'Same as usual', 'Less so than usual', 'Much less capable']
    },
    {
      id: 'q5',
      text: 'Felt constantly under strain?',
      options: ['Not at all', 'No more than usual', 'Rather more than usual', 'Much more than usual']
    },
    {
      id: 'q6',
      text: 'Felt you couldn\'t overcome your difficulties?',
      options: ['Not at all', 'No more than usual', 'Rather more than usual', 'Much more than usual']
    },
    {
      id: 'q7',
      text: 'Been able to enjoy your normal day-to-day activities?',
      options: ['More so than usual', 'Same as usual', 'Less so than usual', 'Much less than usual']
    },
    {
      id: 'q8',
      text: 'Been able to face up to your problems?',
      options: ['More so than usual', 'Same as usual', 'Less able than usual', 'Much less able']
    },
    {
      id: 'q9',
      text: 'Been feeling unhappy and depressed?',
      options: ['Not at all', 'No more than usual', 'Rather more than usual', 'Much more than usual']
    },
    {
      id: 'q10',
      text: 'Been losing confidence in yourself?',
      options: ['Not at all', 'No more than usual', 'Rather more than usual', 'Much more than usual']
    },
    {
      id: 'q11',
      text: 'Been thinking of yourself as a worthless person?',
      options: ['Not at all', 'No more than usual', 'Rather more than usual', 'Much more than usual']
    },
    {
      id: 'q12',
      text: 'Been feeling reasonably happy, all things considered?',
      options: ['More so than usual', 'About same as usual', 'Less so than usual', 'Much less than usual']
    }
  ];

  const handleAnswerSelect = (questionId, optionIndex) => {
    // GHQ scoring: 0-0-1-1
    const score = optionIndex < 2 ? 0 : 1;
    setAnswers(prev => ({
      ...prev,
      [questionId]: { option: optionIndex, score }
    }));
  };

  const calculateResults = () => {
    setShowResults(true);
  };

  const getTotalScore = () => {
    return Object.values(answers).reduce((total, answer) => total + (answer.score || 0), 0);
  };

  const getScoreInterpretation = (score) => {
    if (score <= 2) return { level: 'Low Risk', color: '#4CAF50', description: 'Minimal psychological distress' };
    if (score <= 4) return { level: 'Moderate Risk', color: '#FF9800', description: 'Some distress worth monitoring' };
    return { level: 'Higher Risk', color: '#F44336', description: 'Significant distress - consider professional support' };
  };

  const getCircleClass = (optionIndex) => {
    // big small small big pattern
    // green green red red colors
    const sizes = ['big', 'small', 'small', 'big'];
    const colors = ['green', 'green', 'red', 'red'];
    return `option-circle ${sizes[optionIndex]} ${colors[optionIndex]}`;
  };

  const totalScore = getTotalScore();
  const interpretation = getScoreInterpretation(totalScore);
  const allQuestionsAnswered = Object.keys(answers).length === questions.length;

  if (showResults) {
    return (
      <div className="container">
        <div className="background-overlay"></div>
        <div className="content">
          <div className="header">
          <img src={logo} alt="MannMitra Logo" className="header-logo" />
          <div className="nav">
            <span 
              className="nav-item" 
              onClick={() => navigate("/dashboard/student")}
              style={{ cursor: "pointer" }}
            >
              DASHBOARD
            </span>
            <span className="nav-item">ABOUT US</span>
          </div>

          </div>
          
          <div className="main-content">
            <h1 className="title">GENERAL HEALTH QUESTIONNAIRE</h1>
            <div className="results-container">
              <h2 className="results-title">Your Results</h2>
              <div className="score-display">
                <div className="score-circle-result" style={{ backgroundColor: interpretation.color }}>
                  {totalScore}/12
                </div>
                <div className="score-info">
                  <h3 style={{ color: interpretation.color }}>{interpretation.level}</h3>
                  <p>{interpretation.description}</p>
                </div>
              </div>
              <button className="restart-btn" onClick={() => {
                setShowResults(false);
                setAnswers({});
              }}>
                Take Assessment Again
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container">
      <div className="background-overlay">
        <div className="content">
          <header className="header">
            <img src={logo} alt="MannMitra Logo" className="header-logo" />
            <div className="nav">
              <span 
                className="nav-item" 
                onClick={() => navigate("/dashboard/student")}
                style={{ cursor: "pointer" }}
              >
                DASHBOARD
              </span>
              <span className="nav-item">ABOUT US</span>
            </div>

          </header>
          <div className="main-content">
            <h1 className="title">GENERAL HEALTH QUESTIONNAIRE</h1>
            <h2 className="question-prefix">Have you recently</h2>
            
            <div className="all-questions-container">
              {questions.map((question, questionIndex) => (
                <div key={question.id} className="question-block">
                  <h3 className="question-text">{question.text}</h3>
                  
                  <div className="options-grid">
                    {question.options.map((option, optionIndex) => (
                      <div 
                        key={optionIndex}
                        className={`option-item ${answers[question.id]?.option === optionIndex ? 'selected' : ''}`}
                        onClick={() => handleAnswerSelect(question.id, optionIndex)}
                      >
                        <div className={getCircleClass(optionIndex)}>
                          {answers[question.id]?.option === optionIndex && <div className="option-check">✓</div>}
                        </div>
                        <span className="option-text">{option}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
              
              <div className="submit-section">
                <div className="progress-info">
                  Answered: {Object.keys(answers).length} of {questions.length}
                </div>
                <button 
                  className="calculate-btn" 
                  onClick={calculateResults}
                  disabled={!allQuestionsAnswered}
                >
                  Calculate Results
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GHQ12;