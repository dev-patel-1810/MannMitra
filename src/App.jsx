import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LandingPage from './pages/LandingPage/LandingPage';
import UserSignUp from './pages/UserSignUp/UserSignUp';
import './index.css';
import './App.css';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/user-signup" element={<UserSignUp />} />
      </Routes>
    </Router>
  );
}

export default App;

