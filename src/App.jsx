import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LandingPage from './pages/LandingPage/LandingPage';
import UserSignUp from './pages/SignUp/UserSignUp';
import CounsellorSignUp from './pages/SignUp/CounsellorSignUp';
import CollegeSignUp from './pages/SignUp/CollegeSignUp';
import './index.css';
import './App.css';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/user-signup" element={<UserSignUp />} />
        <Route path="/counsellor-signup" element={<CounsellorSignUp />} />
        <Route path="/college-signup" element={<CollegeSignUp />} />
      </Routes>
    </Router>
  );
}

export default App;

