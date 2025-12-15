// src/hooks/mentee/useMenteeReports.js
import { useEffect, useState } from "react";
import api from "../../axiosInstance";
import { useAuth } from "../../context/useAuth";

export default function useMenteeReports() {
  const { user } = useAuth();
  const menteeId = user?.id;

  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!menteeId) return;

    const fetchReports = async () => {
      try {
        const res = await api.get(`/mentees/${menteeId}/reports`);
        setReports(res.data);
      } catch (err) {
        console.error("Fetch reports error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchReports();
  }, [menteeId]);

  return { reports, loading };
}
