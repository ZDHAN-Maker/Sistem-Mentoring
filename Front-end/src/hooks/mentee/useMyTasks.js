import { useEffect, useState } from "react";
import api, { getCsrfCookie } from "../../axiosInstance";
import { useAuth } from "../../context/useAuth";

export default function useMyTasks() {
  const { authData, loading: authLoading } = useAuth();

  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchTasks = async () => {
    try {
      setLoading(true);

      await getCsrfCookie();

      const res = await api.get("/api/mentee/tasks");

      setTasks(res.data.data ?? []);
    } catch (err) {
      console.error(
        "My tasks error:",
        err.response?.status,
        err.response?.data || err
      );

      setError(
        err.response?.data?.message || "Gagal mengambil data task"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!authLoading && authData) {
      fetchTasks();
    }
  }, [authLoading, authData]);

  return {
    tasks,
    loading: loading || authLoading,
    error,
    refetch: fetchTasks,
  };
}
