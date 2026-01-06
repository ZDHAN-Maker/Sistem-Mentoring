import { useEffect, useState } from "react";
import api, { getCsrfCookie } from "../../axiosInstance";
import { useAuth } from "../../context/useAuth";

export default function useTutoringSchedule() {
  const { authData, loading: authLoading } = useAuth();

  const [schedules, setSchedules] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchSchedules = async () => {
    try {
      setLoading(true);

      await getCsrfCookie();

      const menteeId = authData?.user?.id;
      if (!menteeId) {
        setError("User tidak ditemukan.");
        return;
      }

      console.log("📡 Fetching schedules for mentee:", menteeId);

      const res = await api.get(`/api/mentees/${menteeId}/schedules`);

      console.log("✅ Schedule data:", res.data);

      // Bisa dari {data: []} atau langsung []
      setSchedules(res.data?.data ?? res.data ?? []);
    } catch (err) {
      console.error("❌ Error fetching schedules:", err);

      setError(
        err.response?.data?.message ||
          err.message ||
          "Gagal mengambil data jadwal mentoring"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!authLoading && authData) {
      fetchSchedules();
    }
  }, [authLoading, authData]);

  return {
    schedules,
    loading: loading || authLoading,
    error,
    refetch: fetchSchedules,
  };
}
