import { useEffect, useState } from "react";
import api, { getCsrfCookie } from "../../axiosInstance";
import { useAuth } from "../../context/useAuth";

export default function useMyReports() {
  const { authData, loading: authLoading } = useAuth();

  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchReports = async () => {
    try {
      setLoading(true);

      await getCsrfCookie();

      const menteeId = authData?.user?.id;
      if (!menteeId) {
        setReports([]);
        return;
      }

      const res = await api.get(`/api/mentees/${menteeId}/reports`);

      setReports(res.data ?? []);
    } catch (err) {
      console.error(
        "My reports error:",
        err.response?.status,
        err.response?.data || err
      );

      setError(
        err.response?.data?.message || "Gagal mengambil data laporan"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!authLoading && authData) {
      fetchReports();
    }
  }, [authLoading, authData]);

  return {
    reports,
    loading: loading || authLoading,
    error,
    refetch: fetchReports,
  };
}
