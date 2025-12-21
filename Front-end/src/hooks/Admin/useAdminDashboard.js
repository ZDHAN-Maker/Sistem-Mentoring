import { useState, useEffect } from "react";
import api, { getCsrfCookie } from "../../axiosInstance";

export default function useAdminDashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        await getCsrfCookie();
        const res = await api.get("/api/dashboard");
        setStats(res.data.stats);
      } catch (err) {
        console.error("Dashboard error:", err.response?.data || err);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, []);

  return { stats, loading };
}
