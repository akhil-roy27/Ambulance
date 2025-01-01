import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Login from './components/auth/Login';
import PatientLogin from './components/auth/PatientLogin';
import DriverLogin from './components/auth/DriverLogin';
import PatientSignup from './components/auth/PatientSignup';
import DriverSignup from './components/auth/DriverSignup';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/patient/login" element={<PatientLogin />} />
      <Route path="/driver/login" element={<DriverLogin />} />
      <Route path="/patient/signup" element={<PatientSignup />} />
      <Route path="/driver/signup" element={<DriverSignup />} />
    </Routes>
  );
}

export default App; 