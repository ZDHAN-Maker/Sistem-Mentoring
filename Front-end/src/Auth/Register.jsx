import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { api } from '../axiosInstance'
import { useAuth } from '../context/useAuth'

const Register = () => {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [passwordConfirmation, setPasswordConfirmation] = useState('')
  const [errorMessage, setErrorMessage] = useState('')
  const navigate = useNavigate()
  const { registerUser } = useAuth() // 👈 fungsi baru di context untuk simpan data user

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (password !== passwordConfirmation) {
      setErrorMessage('Password dan konfirmasi password tidak cocok.')
      return
    }

    try {
      // Default role: mentee
      const response = await api.post('/register', {
        name,
        email,
        password,
        password_confirmation: passwordConfirmation,
        role: 'mentee'
      })

      const userData = {
        name: response.data.user?.name || name,
        email: response.data.user?.email || email,
        role: 'mentee'
      }

      // Simpan user ke context biar persist di aplikasi
      registerUser(userData)

      // Setelah register berhasil → arahkan ke login
      navigate('/login')
    } catch (error) {
      console.error('Error register:', error)
      setErrorMessage(
        error.response?.data?.message || 'Pendaftaran gagal! Silakan coba lagi.'
      )
    }
  }

  return (
    <div className='min-h-screen bg-gray-100'>
      {/* Header */}
      <div className='w-full bg-white p-4 shadow-md flex items-center justify-between'>
        <div className='flex items-center'>
          <img
            src='/assets/Logo Sistem Mentoring.png'
            alt='Logo'
            className='w-10 h-10'
          />
          <span className='text-xl ml-2 font-semibold'>Sistem Mentoring</span>
        </div>
        <a
          href='/login'
          className='text-sm text-gray-700 hover:text-blue-600'
        >
          Masuk
        </a>
      </div>

      {/* Form Register */}
      <div className='flex justify-center items-center min-h-screen bg-gray-50'>
        <div className='max-w-md w-full bg-white p-8 rounded-lg shadow-lg'>
          <h2 className='text-3xl font-bold text-left mb-1'>
            Daftar Akun Mentoring
          </h2>
          <p className='text-sm text-gray-500 mb-6'>Silakan isi form berikut</p>

          <form onSubmit={handleSubmit}>
            <label className='block text-sm font-semibold text-gray-700'>
              Nama Lengkap
            </label>
            <input
              className='w-full mt-2 p-3 border border-gray-300 rounded-lg mb-4'
              type='text'
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder='Nama Lengkap'
              required
            />

            <label className='block text-sm font-semibold text-gray-700'>
              Email
            </label>
            <input
              className='w-full mt-2 p-3 border border-gray-300 rounded-lg mb-4'
              type='email'
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder='Alamat Email'
              required
            />

            <label className='block text-sm font-semibold text-gray-700'>
              Password
            </label>
            <input
              className='w-full mt-2 p-3 border border-gray-300 rounded-lg mb-4'
              type='password'
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder='Password Baru'
              required
            />

            <label className='block text-sm font-semibold text-gray-700'>
              Konfirmasi Password
            </label>
            <input
              className='w-full mt-2 p-3 border border-gray-300 rounded-lg mb-4'
              type='password'
              value={passwordConfirmation}
              onChange={(e) => setPasswordConfirmation(e.target.value)}
              placeholder='Konfirmasi Password'
              required
            />

            {errorMessage && (
              <p className='text-red-500 text-xs mt-2'>{errorMessage}</p>
            )}

            <button
              type='submit'
              className='w-full py-3 mt-6 bg-[#b38867] text-white font-semibold rounded-lg hover:bg-[#a27355]'
            >
              Daftar
            </button>
          </form>

          <hr className='my-6' />

          <button className='w-full py-3 border rounded-lg flex items-center justify-center'>
            <img
              src='/assets/google.png'
              alt='Google'
              className='w-5 h-5 mr-2'
            />
            Daftar dengan Google
          </button>

          <p className='text-center text-sm text-gray-500 mt-4'>
            Sudah punya akun?{' '}
            <a href='/login' className='text-blue-500 hover:underline'>
              Masuk sekarang
            </a>
          </p>
        </div>
      </div>
    </div>
  )
}

export default Register
