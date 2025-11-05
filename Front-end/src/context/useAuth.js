// src/context/useAuth.js
import { useContext } from 'react';
import AuthContext from './AuthContext';

// Membuat custom hook untuk menggunakan AuthContext
export const useAuth = () => {
  return useContext(AuthContext);
};
