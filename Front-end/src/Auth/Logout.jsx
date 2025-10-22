// src/components/Logout.jsx
import React from 'react';
import { setAuthHeader } from '../axiosInstance';

const Logout = ({ setAuth }) => {
  const handleLogout = () => {
    localStorage.removeItem('token');  // Hapus token dari localStorage
    setAuth(false); // Set status login ke false
    setAuthHeader('');  // Clear auth header
    window.location.href = '/login'; // Redirect ke halaman login
  };

  return (
    <div>
      <button onClick={handleLogout}>Logout</button>
    </div>
  );
};

export default Logout;
