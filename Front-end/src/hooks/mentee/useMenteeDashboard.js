// src/hooks/mentee/useMenteeDashboard.js
import { useEffect, useState } from "react";
import api, { getCsrfCookie } from "../../axiosInstance";

export default function useMenteeDashboard() {
  const [stats, setStats] = useState(null);
  const [pairings, setPairings] = useState([]);
  const [upcomingSchedules, setUpcomingSchedules] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadDashboard = async () => {
      try {
        await getCsrfCookie();

        const res = await api.get("/api/mentee/dashboard");

        setStats(res.data.stats);
        setPairings(res.data.pairings);
        setUpcomingSchedules(res.data.upcoming_schedules);
      } catch (err) {
        console.error(
          "Mentee dashboard error:",
          err.response?.status,
          err.response?.data || err
        );
      } finally {
        setLoading(false);
      }
    };

    loadDashboard();
  }, []);

  return {
    stats,
    pairings,
    upcomingSchedules,
    loading,
  };
}
