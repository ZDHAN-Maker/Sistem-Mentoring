// hooks/Mentor/useReviewReportMentor.js
import { useCallback, useEffect, useState } from "react";
import api from "../../axiosInstance";

const useReviewReportMentor = () => {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  // Ambil semua progress report mentee
  const fetchReports = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const res = await api.get("/api/mentors/reports");

      // pastikan array
      setReports(res.data || []);
    } catch (err) {
      setError(
        err.response?.data?.message ||
        err.message ||
        "Gagal memuat laporan"
      );
    } finally {
      setLoading(false);
    }
  }, []);

  // Kirim feedback mentor
  const submitFeedback = useCallback(
    async (reportId, feedback) => {
      try {
        setSubmitting(true);
        setError(null);

        await api.post(
          `/api/mentors/reports/${reportId}/feedback`,
          { feedback }
        );

        // refresh data setelah feedback berhasil
        fetchReports();
      } catch (err) {
        setError(
          err.response?.data?.message ||
          err.message ||
          "Gagal mengirim feedback"
        );
      } finally {
        setSubmitting(false);
      }
    },
    [fetchReports]
  );

  useEffect(() => {
    fetchReports();
  }, [fetchReports]);

  return {
    reports,
    loading,
    submitting,
    error,
    submitFeedback,
    refresh: fetchReports,
  };
};

export default useReviewReportMentor;
