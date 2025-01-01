import React, { useState } from 'react';
import axios from 'axios';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('patient');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      let endpoint = role === 'patient' ? '/api/auth/login' : '/api/driver/login';
      const response = await axios.post(endpoint, {
        email,
        password,
      });
      // ... rest of login logic ...
    } catch (error) {
      // ... error handling ...
    }
  };

  return (
    <div className="login-container">
      <select 
        value={role} 
        onChange={(e) => setRole(e.target.value)}
        className="form-select"
      >
        <option value="patient">Patient</option>
        <option value="driver">Driver</option>
      </select>

      <button type="submit">
        Login as {role === 'patient' ? 'Patient' : 'Driver'}
      </button>
    </div>
  );
};

export default Login; 