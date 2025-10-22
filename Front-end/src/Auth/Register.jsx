// src/components/Register.jsx
import React, { useState } from 'react';
import { api } from '../axiosInstance';

const Register = ({ setAuth }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await api.post('/register', { name, email, password });
      // Simpan token di localStorage dan redirect ke dashboard
      localStorage.setItem('token', response.data.token);
      setAuth(true);
      window.location.href = '/dashboard';
    } catch (error) {
      // Menangani error dan menampilkan pesan yang lebih rinci
      setErrorMessage(error.response?.data?.message || 'Registration failed! Please try again.');
    }
  };

  return (
    <div>
      <h2>Register</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Name:</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>
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
        <button type="submit">Register</button>
      </form>
      {/* Menampilkan pesan error jika ada */}
      {errorMessage && <p>{errorMessage}</p>}
    </div>
  );
};

export default Register;
