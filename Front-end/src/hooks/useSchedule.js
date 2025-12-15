// src/hooks/useSchedule.js
import { useState, useEffect, useCallback } from "react";
import api, { getCsrfCookie } from "../axiosInstance";

export default function useSchedule() {
  const [schedules, setSchedules] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // GET schedules (Admin, Mentor, Mentee)
  const fetchSchedules = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      await getCsrfCookie(); // ⬅ WAJIB: ambil CSRF dulu

      const res = await api.get("/api/schedules");
      setSchedules(res.data.data);
    } catch (err) {
      setError(err.response?.data?.message || "Error memuat jadwal");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSchedules();
  }, [fetchSchedules]);

  // CREATE (Admin & Mentor)
  const createNewSchedule = async (data) => {
    try {
      await getCsrfCookie();
      await api.post("/api/schedules", data);
      await fetchSchedules();
    } catch (err) {
      throw err.response?.data?.message || "Gagal membuat jadwal";
    }
  };

  // UPDATE (Admin & Mentor)
  const editSchedule = async (id, data) => {
    try {
      await getCsrfCookie();
      await api.put(`/api/schedules/${id}`, data);
      await fetchSchedules();
    } catch (err) {
      throw err.response?.data?.message || "Gagal memperbarui jadwal";
    }
  };

  // DELETE (Admin & Mentor)
  const removeSchedule = async (id) => {
    try {
      await getCsrfCookie();
      await api.delete(`/api/schedules/${id}`);
      await fetchSchedules();
    } catch (err) {
      throw err.response?.data?.message || "Gagal menghapus jadwal";
    }
  };

  return {
    schedules,
    loading,
    error,
    fetchSchedules,
    createNewSchedule,
    editSchedule,
    removeSchedule,
  };
}
