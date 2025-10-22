// src/components/Login.jsx
import React, { useState } from 'react';
import { api } from '../axiosInstance'; 

const Login = ({ setAuth }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await api.post('/login', { email, password });
      // Simpan token di localStorage atau context (disarankan)
      localStorage.setItem('token', response.data.token);
      setAuth(true);
      window.location.href = '/dashboard'; 
    } catch (error) {
      setErrorMessage(error.response?.data?.message || 'Login failed! Please check your credentials.');
    }
  };

  return (
    <div>
      <h2>Login</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Email:</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Password:</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit">Login</button>
      </form>
      {/* Menampilkan pesan error jika ada */}
      {errorMessage && <p>{errorMessage}</p>}
    </div>
  );
};

export default Login;
