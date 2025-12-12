import { useEffect, useState } from "react";
import api from "../axiosInstance";

export default function useAdminUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadUsers = async () => {
    try {
      const res = await api.get("/api/admin/users");
      setUsers(res.data.users);
    } catch (err) {
      console.error("Load users error:", err);
    } finally {
      setLoading(false);
    }
  };

  const updateRole = async (id, role) => {
    try {
      await api.put(`/api/admin/users/${id}/role`, { role });
      loadUsers();
    } catch (err) {
      console.error("Update role error:", err);
    }
  };

  const deleteUser = async (id) => {
    try {
      await api.delete(`/api/admin/users/${id}`);
      loadUsers();
    } catch (err) {
      console.error("Delete user error:", err);
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  return { users, loading, updateRole, deleteUser };
}
