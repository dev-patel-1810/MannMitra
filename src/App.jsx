import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LandingPage from './pages/LandingPage/LandingPage';
import UserSignUp from './pages/Authentication/UserSignUp';
import CounsellorSignUp from './pages/Authentication/CounsellorSignUp';
import CollegeSignUp from './pages/Authentication/CollegeSignUp';
import GHQ12 from './pages/GHQ12/GHQ12'
import Login from './pages/Authentication/Login'
import Dash_Student from './pages/Dashboard/Dash_Student';
import Dash_Counsellor from './pages/Dashboard/Dash_Counsellor';
import Dash_Institute from './pages/Dashboard/Dash_Institute';
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
        <Route path="/ghq12-test" element={<GHQ12 />} />
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard/student" element={<Dash_Student />} />
        <Route path="/dashboard/counsellor" element={<Dash_Counsellor />} />
        <Route path="/dashboard/institute" element={<Dash_Institute />} />
      </Routes>
    </Router>
  );
}

export default App;

