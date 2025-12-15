import { useEffect, useState } from "react";
import api from "../../axiosInstance";
import { useAuth } from "../../context/useAuth";

export default function useMyTasks() {
  const { user } = useAuth();

  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchTasks = async () => {
    if (!user || !user.id) {
      setError("User data tidak tersedia.");
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      console.log("📡 Fetching tasks for mentee ID:", user.id);

      const res = await api.get(`/mentees/${user.id}/tasks`);

      console.log("✅ Tasks data:", res.data);

      setTasks(res.data.data || res.data.tasks || res.data || []);
    } catch (err) {
      console.error("❌ Error fetching tasks:", err);
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
    fetchTasks();
  }, [user]);

  return {
    tasks,
    loading,
    error,
    refetch: fetchTasks,
  };
}
