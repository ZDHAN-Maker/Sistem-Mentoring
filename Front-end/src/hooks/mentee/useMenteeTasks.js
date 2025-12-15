// src/hooks/mentee/useMenteeTasks.js
import { useEffect, useState } from "react";
import api from "../../axiosInstance";
import { useAuth } from "../../context/useAuth";

export default function useMenteeTasks() {
  const { user } = useAuth();
  const menteeId = user?.id;

  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!menteeId) return;

    const fetchTasks = async () => {
      try {
        const res = await api.get(`/mentees/${menteeId}/tasks`);
        setTasks(res.data);
      } catch (err) {
        console.error("Fetch tasks error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchTasks();
  }, [menteeId]);

  return { tasks, loading };
}
