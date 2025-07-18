import React from 'react';
import { Routes, Route } from 'react-router-dom'; // Removed BrowserRouter
import LoginSignup from './components/loginSignup';
import StudentProfile from './components/studentProfile';
import TeacherDashboard from './components/teacherDashboard';

function App() {
  return (
    <Routes>
      <Route path="/" element={<LoginSignup />} />
      <Route path="/student/profile" element={<StudentProfile />} />
      <Route path="/teacher/dashboard" element={<TeacherDashboard />} />
    </Routes>
  );
}

export default App;