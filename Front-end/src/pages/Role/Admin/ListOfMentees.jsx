import React, { useState, useEffect } from "react";
import api from "../../../axiosInstance";
import { 
  Users, 
  UserCheck, 
  GraduationCap, 
  ShieldCheck, 
  Search, 
  RefreshCw, 
  Trash2, 
  CheckCircle2, 
  AlertCircle,
  X 
} from "lucide-react";

const ListOfMentees = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("all"); // 'all', 'Mentee', 'Mentor', 'Admin'
  const [searchTerm, setSearchTerm] = useState("");
  const [feedback, setFeedback] = useState(null);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await api.get("/users");
      setUsers(res.data || []);
    } catch (err) {
      console.error("Gagal mengambil data user:", err);
      setFeedback({ type: "error", message: "Gagal memuat daftar pengguna." });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleDeleteUser = async (userId, userName) => {
    if (!window.confirm(`Apakah Anda yakin ingin menghapus akun "${userName}"? Tindakan ini tidak dapat dibatalkan.`)) {
      return;
    }

    try {
      await api.delete(`/users/${userId}`);
      setFeedback({ type: "success", message: `Pengguna "${userName}" berhasil dihapus.` });
      setUsers((prev) => prev.filter((u) => u.id !== userId));
    } catch (err) {
      setFeedback({ 
        type: "error", 
        message: err.response?.data?.message || "Gagal menghapus pengguna." 
      });
    }
  };

  // Filter berdasarkan Tab Role & Search Term
  const filteredUsers = users.filter((u) => {
    const roles = u.roles?.map((r) => r.name) || [];
    const matchesTab = activeTab === "all" ? true : roles.includes(activeTab);
    const term = searchTerm.toLowerCase();
    const matchesSearch = u.name?.toLowerCase().includes(term) || u.email?.toLowerCase().includes(term);
    return matchesTab && matchesSearch;
  });

  const countByRole = (roleName) => {
    if (roleName === "all") return users.length;
    return users.filter((u) => u.roles?.some((r) => r.name === roleName)).length;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Manajemen Pengguna</h1>
          <p className="text-gray-500 text-sm mt-1">
            Lihat dan kelola seluruh akun pengguna terdaftar (Mentee, Mentor, dan Administrator).
          </p>
        </div>
        <button
          onClick={fetchUsers}
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-white border border-gray-300 rounded-xl hover:bg-gray-50 text-gray-700 text-sm font-medium transition self-start sm:self-auto"
        >
          <RefreshCw size={16} />
          Refresh
        </button>
      </div>

      {/* Alert Feedback */}
      {feedback && (
        <div
          className={`p-4 rounded-xl text-sm flex items-center justify-between ${
            feedback.type === "success"
              ? "bg-emerald-50 border border-emerald-200 text-emerald-800"
              : "bg-red-50 border border-red-200 text-red-800"
          }`}
        >
          <div className="flex items-center gap-2">
            {feedback.type === "success" ? <CheckCircle2 size={18} /> : <AlertCircle size={18} />}
            <span>{feedback.message}</span>
          </div>
          <button onClick={() => setFeedback(null)} className="text-gray-400 hover:text-gray-600">
            <X size={16} />
          </button>
        </div>
      )}

      {/* Tabs & Search Filter */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        {/* Role Tabs */}
        <div className="flex items-center gap-2 bg-gray-100 p-1.5 rounded-2xl self-start overflow-x-auto max-w-full">
          {[
            { id: "all", label: "Semua", icon: Users },
            { id: "Mentee", label: "Mentee", icon: GraduationCap },
            { id: "Mentor", label: "Mentor", icon: UserCheck },
            { id: "Admin", label: "Admin", icon: ShieldCheck },
          ].map((tab) => {
            const Icon = tab.icon;
            const active = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold transition whitespace-nowrap ${
                  active
                    ? "bg-white text-gray-800 shadow-sm"
                    : "text-gray-500 hover:text-gray-700"
                }`}
              >
                <Icon size={15} />
                <span>{tab.label}</span>
                <span className={`px-2 py-0.5 rounded-full text-[10px] ${active ? "bg-gray-100 text-gray-700" : "bg-gray-200 text-gray-500"}`}>
                  {countByRole(tab.id)}
                </span>
              </button>
            );
          })}
        </div>

        {/* Search */}
        <div className="bg-white px-4 py-2.5 rounded-2xl border border-gray-200 shadow-sm flex items-center gap-2.5 w-full md:w-72">
          <Search size={16} className="text-gray-400" />
          <input
            type="text"
            placeholder="Cari nama atau email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full text-sm outline-none text-gray-700 placeholder-gray-400"
          />
        </div>
      </div>

      {/* Tabel Pengguna */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-12 flex items-center justify-center text-gray-500">
            <RefreshCw className="animate-spin text-[#b38867] mr-3" size={20} />
            <span>Memuat data pengguna...</span>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-gray-50 text-gray-600 font-medium border-b border-gray-100">
                <tr>
                  <th className="py-4 px-6">ID</th>
                  <th className="py-4 px-6">Pengguna</th>
                  <th className="py-4 px-6">Role</th>
                  <th className="py-4 px-6">Status Akun</th>
                  <th className="py-4 px-6">Terdaftar Sejak</th>
                  <th className="py-4 px-6 text-center">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredUsers.length > 0 ? (
                  filteredUsers.map((u) => {
                    const roleNames = u.roles?.map((r) => r.name) || [];
                    return (
                      <tr key={u.id} className="hover:bg-gray-50/70 transition">
                        <td className="py-4 px-6 font-mono text-xs text-gray-400">#{u.id}</td>
                        <td className="py-4 px-6">
                          <div className="font-semibold text-gray-800">{u.name}</div>
                          <div className="text-xs text-gray-500">{u.email}</div>
                        </td>
                        <td className="py-4 px-6">
                          <div className="flex flex-wrap gap-1.5">
                            {roleNames.map((rn, i) => (
                              <span
                                key={i}
                                className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                  rn === "Admin"
                                    ? "bg-purple-100 text-purple-700"
                                    : rn === "Mentor"
                                    ? "bg-amber-100 text-amber-700"
                                    : "bg-emerald-100 text-emerald-700"
                                }`}
                              >
                                {rn}
                              </span>
                            ))}
                          </div>
                        </td>
                        <td className="py-4 px-6">
                          <span
                            className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${
                              u.is_active
                                ? "bg-green-100 text-green-700"
                                : "bg-red-100 text-red-600"
                            }`}
                          >
                            <span className={`w-1.5 h-1.5 rounded-full ${u.is_active ? "bg-green-500" : "bg-red-500"}`}></span>
                            {u.is_active ? "Aktif" : "Non-aktif"}
                          </span>
                        </td>
                        <td className="py-4 px-6 text-xs text-gray-500">
                          {u.created_at ? new Date(u.created_at).toLocaleDateString("id-ID") : "-"}
                        </td>
                        <td className="py-4 px-6 text-center">
                          <button
                            onClick={() => handleDeleteUser(u.id, u.name)}
                            className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition"
                            title="Hapus Pengguna"
                          >
                            <Trash2 size={16} />
                          </button>
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan={6} className="py-10 text-center text-gray-400">
                      Tidak ada pengguna yang sesuai dengan kriteria filter.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default ListOfMentees;
