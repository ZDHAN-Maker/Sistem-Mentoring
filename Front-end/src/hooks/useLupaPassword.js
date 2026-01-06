// src/hooks/useLupaPassword.js
import { useState } from "react";
import api, { getCsrfCookie } from "../axiosInstance";

export default function useLupaPassword(token, email) {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    if (password !== confirmPassword) {
      setMessage("Password dan konfirmasi password tidak sama.");
      setLoading(false);
      return;
    }

    try {
      await getCsrfCookie();
      const res = await api.post("/api/reset-password", {
        token,
        email,
        password,
        password_confirmation: confirmPassword,
      });
      setMessage(res.data.message);
    } catch (err) {
      console.error(err);
      if (err.response?.data?.message) {
        setMessage(err.response.data.message);
      } else {
        setMessage("Terjadi kesalahan, coba lagi.");
      }
    } finally {
      setLoading(false);
    }
  };

  return { 
    password, setPassword, 
    confirmPassword, setConfirmPassword, 
    loading, message, handleSubmit 
  };
}
