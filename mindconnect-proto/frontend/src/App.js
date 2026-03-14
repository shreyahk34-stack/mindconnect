import React from 'react';
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import Home from './pages/Home';
import Dashboard from './pages/Dashboard';
import Screening from './pages/Screening';
import Chatbot from './pages/Chatbot';
import Counselors from './pages/Counselors';
import Therapy from './pages/Therapy';
import ParentForm from './pages/ParentForm';
import Login from './pages/login';
import Profile from './pages/Profile';
import EmotionalAnalysis from './pages/EmotionalAnalysis';
import AcademicPlanner from './pages/AcademicPlanner';
import DietPlannerPage from './pages/DietPlanner';
import ProtectedRoute from './components/ProtectedRoute';

export default function App(){

  return (
    <BrowserRouter>
      <div className="topnav">
        <Link to="/">Home</Link> | <Link to="/dashboard">Dashboard</Link> | <Link to="/profile">Profile</Link> | <Link to="/emotional">Emotion Analysis</Link> | <Link to="/planner">Academic Planner</Link> | <Link to="/diet">Diet Planner</Link> | <Link to="/screening">Screening</Link> | <Link to="/chat">Chatbot</Link> | <Link to="/counselors">Counselors</Link> | <Link to="/therapy">Therapy</Link> | <Link to="/parent">Parent Form</Link>
      </div>
      <Routes>
        <Route path="/" element={<Home/>}/>
        <Route path="/login" element={<Login/>}/>
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/planner"
          element={
            <ProtectedRoute>
              <AcademicPlanner />
            </ProtectedRoute>
          }
        />
        <Route
          path="/diet"
          element={
            <ProtectedRoute>
              <DietPlannerPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/screening"
          element={
            <ProtectedRoute>
              <Screening />
            </ProtectedRoute>
          }
        />
        <Route
          path="/chat"
          element={
            <ProtectedRoute>
              <Chatbot />
            </ProtectedRoute>
          }
        />
        <Route
          path="/counselors"
          element={
            <ProtectedRoute>
              <Counselors />
            </ProtectedRoute>
          }
        />
        <Route
          path="/therapy"
          element={
            <ProtectedRoute>
              <Therapy />
            </ProtectedRoute>
          }
        />
        <Route
          path="/parent"
          element={
            <ProtectedRoute>
              <ParentForm />
            </ProtectedRoute>
          }
        />
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />
        <Route
          path="/emotional"
          element={
            <ProtectedRoute>
              <EmotionalAnalysis />
            </ProtectedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}
