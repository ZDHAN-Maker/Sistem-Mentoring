import { useEffect, useState } from "react";
import api from "../axiosInstance";
import { useAuth } from "../context/useAuth";

export default function useMyReports() {
  const { user } = useAuth();

  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchReports = async () => {
    if (!user || !user.id) {
      setError("User data tidak tersedia.");
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      console.log("📡 Fetching reports for mentee ID:", user.id);

      const res = await api.get(`/mentees/${user.id}/reports`);

      console.log("✅ Reports data:", res.data);

      setReports(res.data.data || res.data.reports || res.data || []);
    } catch (err) {
      console.error("❌ Error fetching reports:", err);
      setError(
        err.response?.data?.message ||
          err.message ||
          "Terjadi kesalahan"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReports();
  }, [user]);

  return {
    reports,
    loading,
    error,
    refetch: fetchReports,
  };
}
