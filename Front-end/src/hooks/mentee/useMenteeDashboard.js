// src/hooks/mentee/useMenteeDashboard.js
import { useEffect, useState } from "react";
import api from "../../axiosInstance";
import { useAuth } from "../../context/useAuth";

export default function useMenteeDashboard() {
  const { user } = useAuth();
  const menteeId = user?.id;

  const [tasks, setTasks] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!menteeId) return;

    setLoading(true);

    api
      .get(`/mentees/${menteeId}/dashboard`)
      .then((res) => {
        setTasks(res.data.tasks);
        setStats(res.data.stats);
      })
      .finally(() => setLoading(false));
  }, [menteeId]);

  return {
    tasks,
    stats,
    loading,
  };
}
