// src/context/AuthContext.js
import React, { createContext, useState } from 'react'

const AuthContext = createContext()

export const AuthProvider = ({ children }) => {
  const [auth, setAuth] = useState(false)
  const [role, setRole] = useState(null)
  const [token, setToken] = useState(null)
  const [user, setUser] = useState(null) // 👈 simpan data user (mentee)

  // Fungsi login menerima token & role
  const login = (token, role) => {
    setAuth(true)
    setRole(role)
    setToken(token)
  }

  // Fungsi logout
  const logout = () => {
    setAuth(false)
    setRole(null)
    setToken(null)
    setUser(null)
  }

  // Fungsi register (default mentee)
  const registerUser = (userData) => {
    setUser(userData)
    setAuth(false) // belum login otomatis
    setRole('mentee') // default role
  }

  return (
    <AuthContext.Provider
      value={{
        auth,
        role,
        token,
        user,
        login,
        logout,
        registerUser
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export default AuthContext
