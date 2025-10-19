import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LandingPage from './pages/LandingPage/LandingPage';
import UserSignUp from './pages/Authentication/UserSignUp';
import CounsellorSignUp from './pages/Authentication/CounsellorSignUp';
import CollegeSignUp from './pages/Authentication/CollegeSignUp';
import GHQ12 from './pages/GHQ12/GHQ12';
import Login from './pages/Authentication/Login';
import Dash_Student from './pages/Dashboard/Dash_Student';
import Dash_Counsellor from './pages/Dashboard/Dash_Counsellor';
import Dash_Institute from './pages/Dashboard/Dash_Institute';
import ProtectedRoute from "./components/ProtectedRoute/ProtectedRoute";
import AppointmentBooking from "./pages/Appointment/AppointmentBooking";
import WellnessForest from './pages/WellnessForest/WellnessForest';
import Unauthorized from './pages/Unauthorized/Unauthorized'; // 👈 create/import this
import SelfHelpVideos from './pages/Resources/SelfHelpVideos';
import CalmingMusic from './pages/Resources/CalmingMusic';
import './index.css';
import './App.css';

function App() {
  return (
    <Router>
      <Routes>
        {/* Public routes */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/user-signup" element={<UserSignUp />} />
        <Route path="/counsellor-signup" element={<CounsellorSignUp />} />
        <Route path="/college-signup" element={<CollegeSignUp />} />
        <Route path="/login" element={<Login />} />

        <Route path="/resources/self-help" element={<SelfHelpVideos />} />
        <Route path="/resources/calming-music" element={<CalmingMusic />} />

        {/* Protected routes for specific roles */}
        <Route
          path="/ghq12-test"
          element={
            <ProtectedRoute allowedRoles={["student"]}>
              <GHQ12 />
            </ProtectedRoute>
          }
        />

        <Route
          path="/dashboard/student"
          element={
            <ProtectedRoute allowedRoles={["student"]}>
              <Dash_Student />
            </ProtectedRoute>
          }
        />

        <Route
          path="/dashboard/counsellor"
          element={
            <ProtectedRoute allowedRoles={["counsellor"]}>
              <Dash_Counsellor />
            </ProtectedRoute>
          }
        />

        <Route
          path="/dashboard/institute"
          element={
            <ProtectedRoute allowedRoles={["institute"]}>
              <Dash_Institute />
            </ProtectedRoute>
          }
        />

        <Route
          path="/appointment"
          element={
            <ProtectedRoute allowedRoles={["student"]}>
              <AppointmentBooking />
            </ProtectedRoute>
          }
        />

        <Route
          path="/wellness-forest"
          element={
            <ProtectedRoute allowedRoles={["student"]}>
              <WellnessForest />
            </ProtectedRoute>
          }
        />

        {/* Unauthorized fallback */}
        <Route path="/unauthorized" element={<Unauthorized />} />
      </Routes>
    </Router>
  );
}

export default App;
