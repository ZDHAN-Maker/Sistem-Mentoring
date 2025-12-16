import { useEffect, useState } from "react";
import api from "../../axiosInstance";
import { useAuth } from "../../context/useAuth";

export default function useTutoringSchedule() {
  const { user } = useAuth();

  const [schedules, setSchedules] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchSchedules = async () => {
    if (!user || !user.id) {
      setError("User data tidak tersedia");
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      console.log("📡 Fetching schedules for mentee:", user.id);

      const res = await api.get(`/mentees/${user.id}/schedules`);

      console.log("✅ Schedule data:", res.data);

      setSchedules(res.data.data || res.data || []);
    } catch (err) {
      console.error("❌ Error fetching schedules:", err);
      setError(
        err.response?.data?.message ||
          err.message ||
          "Gagal mengambil jadwal mentoring"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSchedules();
  }, [user]);

  return {
    schedules,
    loading,
    error,
    refetch: fetchSchedules,
  };
}
