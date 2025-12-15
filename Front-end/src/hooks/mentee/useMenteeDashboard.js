// src/hooks/mentee/useMenteeDashboard.js
import { useEffect, useState } from "react";
import api from "../../axiosInstance";
import { useAuth } from "../../context/useAuth";

export default function useMenteeDashboard() {
  const { user } = useAuth();
  const menteeId = user?.id;

  const [tasks, setTasks] = useState([]);
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!menteeId) return;

    const fetchDashboard = async () => {
      try {
        setLoading(true);

        const [tasksRes, reportsRes] = await Promise.all([
          api.get(`/mentees/${menteeId}/tasks`),
          api.get(`/mentees/${menteeId}/reports`)
        ]);

        setTasks(tasksRes.data);
        setReports(reportsRes.data);
      } catch (err) {
        console.error("Dashboard mentee error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboard();
  }, [menteeId]);

  return {
    tasks,
    reports,
    loading,
    totalTasks: tasks.length,
    totalReports: reports.length,
    completedTasks: tasks.filter(t => t.status === "approved").length
  };
}
