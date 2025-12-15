import { useEffect, useState } from "react";
import api from "../axiosInstance";
import { useAuth } from "../context/useAuth";

export default function useNotifications() {
  const { user } = useAuth();
  const token = user?.token;

  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchNotifications = async () => {
    try {
      const res = await api.get("/api/notifications", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setNotifications(res.data);
    } catch (error) {
      console.error("Error fetch notifications:", error);
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = async (id) => {
    await api.put(`/api/notifications/${id}/read`, null, {
      headers: { Authorization: `Bearer ${token}` },
    });
    fetchNotifications();
  };

  const deleteNotification = async (id) => {
    await api.delete(`/api/notifications/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    fetchNotifications();
  };

  useEffect(() => {
    if (!token) return;

    fetchNotifications();
    const interval = setInterval(fetchNotifications, 5000);

    return () => clearInterval(interval);
  }, [token]);

  return { notifications, loading, markAsRead, deleteNotification };
}
