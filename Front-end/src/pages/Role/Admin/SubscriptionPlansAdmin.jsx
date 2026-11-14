import React, { useState, useEffect } from "react";
import api from "../../../axiosInstance";
import { 
  Package, 
  Plus, 
  Edit, 
  Trash2, 
  RefreshCw, 
  CheckCircle2, 
  AlertCircle, 
  X,
  Sparkles,
  ToggleLeft,
  ToggleRight
} from "lucide-react";

const SubscriptionPlansAdmin = () => {
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [feedback, setFeedback] = useState(null);

  // Modal State
  const [showModal, setShowModal] = useState(false);
  const [editingPlan, setEditingPlan] = useState(null);

  // Form State
  const [formData, setFormData] = useState({
    title: "",
    price: "",
    numeric_price: 0,
    period: "bulan",
    icon: "📦",
    button_text: "Pilih Paket",
    is_popular: false,
    is_active: true,
    features: [{ text: "", available: true }],
  });

  const fetchPlans = async () => {
    setLoading(true);
    try {
      const res = await api.get("/subscription-plans");
      setPlans(res.data.data || []);
    } catch (err) {
      console.error("Gagal mengambil paket langganan:", err);
      setFeedback({ type: "error", message: "Gagal memuat paket langganan." });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPlans();
  }, []);

  const openCreateModal = () => {
    setEditingPlan(null);
    setFormData({
      title: "",
      price: "",
      numeric_price: 0,
      period: "bulan",
      icon: "📦",
      button_text: "Pilih Paket",
      is_popular: false,
      is_active: true,
      features: [
        { text: "Akses materi pembelajaran", available: true },
        { text: "Mentoring intensif 1-on-1", available: false },
      ],
    });
    setShowModal(true);
  };

  const openEditModal = (plan) => {
    setEditingPlan(plan);
    setFormData({
      title: plan.title,
      price: plan.price,
      numeric_price: plan.numeric_price || 0,
      period: plan.period || "bulan",
      icon: plan.icon || "📦",
      button_text: plan.button_text || "Pilih Paket",
      is_popular: Boolean(plan.is_popular),
      is_active: Boolean(plan.is_active),
      features: plan.features && plan.features.length > 0
        ? plan.features
        : [{ text: "", available: true }],
    });
    setShowModal(true);
  };

  const handleAddFeatureField = () => {
    setFormData({
      ...formData,
      features: [...formData.features, { text: "", available: true }],
    });
  };

  const handleRemoveFeatureField = (index) => {
    const updated = formData.features.filter((_, i) => i !== index);
    setFormData({ ...formData, features: updated });
  };

  const handleFeatureChange = (index, field, value) => {
    const updated = [...formData.features];
    updated[index][field] = value;
    setFormData({ ...formData, features: updated });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title || !formData.price) {
      setFeedback({ type: "error", message: "Nama paket dan label harga wajib diisi." });
      return;
    }

    // Filter fitur yang tidak kosong
    const cleanedFeatures = formData.features.filter((f) => f.text.trim() !== "");

    setSubmitting(true);
    setFeedback(null);
    try {
      const payload = {
        ...formData,
        features: cleanedFeatures,
      };

      if (editingPlan) {
        await api.put(`/subscription-plans/${editingPlan.id}`, payload);
        setFeedback({ type: "success", message: "Paket langganan berhasil diperbarui!" });
      } else {
        await api.post("/subscription-plans", payload);
        setFeedback({ type: "success", message: "Paket langganan baru berhasil ditambahkan!" });
      }

      setShowModal(false);
      fetchPlans();
    } catch (err) {
      const msg = err.response?.data?.message || "Gagal menyimpan paket langganan.";
      setFeedback({ type: "error", message: msg });
    } finally {
      setSubmitting(false);
    }
  };

  const handleToggleActive = async (plan) => {
    try {
      await api.patch(`/subscription-plans/${plan.id}/toggle-active`);
      setFeedback({ 
        type: "success", 
        message: `Status paket "${plan.title}" berhasil diubah.` 
      });
      fetchPlans();
    } catch (err) {
      setFeedback({ 
        type: "error", 
        message: err.response?.data?.message || "Gagal mengubah status paket." 
      });
    }
  };

  const handleDelete = async (plan) => {
    if (!window.confirm(`Apakah Anda yakin ingin menghapus paket "${plan.title}"?`)) return;

    try {
      await api.delete(`/subscription-plans/${plan.id}`);
      setFeedback({ type: "success", message: `Paket "${plan.title}" berhasil dihapus.` });
      setPlans((prev) => prev.filter((p) => p.id !== plan.id));
    } catch (err) {
      setFeedback({ 
        type: "error", 
        message: err.response?.data?.message || "Gagal menghapus paket." 
      });
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Manajemen Paket Langganan</h1>
          <p className="text-gray-500 text-sm mt-1">
            Atur paket, harga, fitur, dan penawaran yang tampil di halaman publik /Langganan.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={fetchPlans}
            className="p-2.5 text-gray-600 bg-white border border-gray-300 rounded-xl hover:bg-gray-50 transition"
            title="Refresh Data"
          >
            <RefreshCw size={18} />
          </button>
          <button
            onClick={openCreateModal}
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-[#b38867] hover:bg-[#a27355] text-white text-sm font-semibold rounded-xl shadow-sm transition"
          >
            <Plus size={18} />
            Tambah Paket
          </button>
        </div>
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

      {/* Grid Paket */}
      {loading ? (
        <div className="p-12 flex items-center justify-center text-gray-500 bg-white rounded-2xl border border-gray-200">
          <RefreshCw className="animate-spin text-[#b38867] mr-3" size={20} />
          <span>Memuat paket langganan...</span>
        </div>
      ) : plans.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {plans.map((p) => (
            <div
              key={p.id}
              className={`bg-white rounded-2xl border ${
                p.is_popular ? "border-[#b38867] shadow-lg ring-1 ring-[#b38867]/20" : "border-gray-200 shadow-sm"
              } p-6 flex flex-col justify-between relative transition hover:shadow-md`}
            >
              {p.is_popular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-[#b38867] text-white text-xs font-semibold px-3 py-1 rounded-full flex items-center gap-1 shadow-sm">
                  <Sparkles size={12} /> Paling Populer
                </div>
              )}

              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-3xl">{p.icon || "📦"}</span>
                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => handleToggleActive(p)}
                      title={p.is_active ? "Nonaktifkan paket" : "Aktifkan paket"}
                      className={`text-xs px-2.5 py-1 rounded-full font-medium transition ${
                        p.is_active
                          ? "bg-green-100 text-green-700 hover:bg-green-200"
                          : "bg-gray-100 text-gray-500 hover:bg-gray-200"
                      }`}
                    >
                      {p.is_active ? "Aktif" : "Non-aktif"}
                    </button>
                  </div>
                </div>

                <h3 className="text-xl font-bold text-gray-800">{p.title}</h3>
                <p className="text-2xl font-extrabold text-[#b38867] mt-2">{p.price}</p>

                {/* Features */}
                <div className="mt-5 space-y-2.5 pt-4 border-t border-gray-100">
                  <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Fitur Paket:</p>
                  {p.features && p.features.length > 0 ? (
                    p.features.map((f, i) => (
                      <div key={i} className="flex items-center gap-2 text-xs">
                        <span
                          className={`w-4 h-4 rounded-full flex items-center justify-center text-[10px] font-bold ${
                            f.available ? "bg-green-100 text-green-600" : "bg-gray-100 text-gray-400"
                          }`}
                        >
                          {f.available ? "✓" : "✕"}
                        </span>
                        <span className={f.available ? "text-gray-700 font-medium" : "text-gray-400 line-through"}>
                          {f.text}
                        </span>
                      </div>
                    ))
                  ) : (
                    <p className="text-xs text-gray-400 italic">Belum ada rincian fitur.</p>
                  )}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-5 mt-6 border-t border-gray-100 flex items-center justify-between text-xs">
                <span className="text-gray-400 font-mono">ID #{p.id}</span>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => openEditModal(p)}
                    className="p-2 text-gray-600 hover:text-[#b38867] hover:bg-[#b38867]/10 rounded-xl transition"
                    title="Ubah Paket"
                  >
                    <Edit size={16} />
                  </button>
                  <button
                    onClick={() => handleDelete(p)}
                    className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-xl transition"
                    title="Hapus Paket"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="p-12 text-center bg-white rounded-2xl border border-gray-200 text-gray-400">
          <Package size={36} className="mx-auto mb-2 text-gray-300" />
          <p className="text-sm">Belum ada paket langganan yang dibuat.</p>
          <button
            onClick={openCreateModal}
            className="mt-3 text-xs font-semibold text-[#b38867] hover:underline"
          >
            + Buat Paket Langganan Pertama
          </button>
        </div>
      )}

      {/* Modal Tambah/Edit Paket */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4 overflow-y-auto">
          <div className="bg-white w-full max-w-lg rounded-2xl shadow-xl border border-gray-200 overflow-hidden my-8 animate-in fade-in zoom-in-95 duration-200">
            <div className="p-6 border-b border-gray-100 flex items-center justify-between">
              <h2 className="text-lg font-bold text-gray-800">
                {editingPlan ? "Ubah Paket Langganan" : "Tambah Paket Langganan Baru"}
              </h2>
              <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-gray-600">
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[75vh] overflow-y-auto">
              <div className="grid grid-cols-3 gap-3">
                <div className="col-span-2">
                  <label className="block text-xs font-semibold text-gray-600 mb-1">
                    Nama Paket <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Misal: Paket Pro Mentoring"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="w-full p-2.5 text-sm border border-gray-300 rounded-xl focus:ring-1 focus:ring-[#b38867] outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1">Icon Emoji</label>
                  <input
                    type="text"
                    placeholder="👑"
                    value={formData.icon}
                    onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
                    className="w-full p-2.5 text-sm border border-gray-300 rounded-xl text-center focus:ring-1 focus:ring-[#b38867] outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1">
                    Label Harga <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Rp 99.000 / bulan"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    className="w-full p-2.5 text-sm border border-gray-300 rounded-xl focus:ring-1 focus:ring-[#b38867] outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1">Harga Numerik (IDR)</label>
                  <input
                    type="number"
                    min="0"
                    placeholder="99000"
                    value={formData.numeric_price}
                    onChange={(e) => setFormData({ ...formData, numeric_price: parseInt(e.target.value) || 0 })}
                    className="w-full p-2.5 text-sm border border-gray-300 rounded-xl focus:ring-1 focus:ring-[#b38867] outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1">Teks Tombol</label>
                  <input
                    type="text"
                    placeholder="Beli Sekarang"
                    value={formData.button_text}
                    onChange={(e) => setFormData({ ...formData, button_text: e.target.value })}
                    className="w-full p-2.5 text-sm border border-gray-300 rounded-xl focus:ring-1 focus:ring-[#b38867] outline-none"
                  />
                </div>
                <div className="flex flex-col justify-end">
                  <label className="flex items-center gap-2 p-2.5 border border-gray-200 rounded-xl cursor-pointer hover:bg-gray-50 text-xs font-medium text-gray-700">
                    <input
                      type="checkbox"
                      checked={formData.is_popular}
                      onChange={(e) => setFormData({ ...formData, is_popular: e.target.checked })}
                      className="rounded text-[#b38867] focus:ring-[#b38867] h-4 w-4"
                    />
                    Tandai Paling Populer
                  </label>
                </div>
              </div>

              {/* Rincian Fitur Dinamis */}
              <div className="pt-2">
                <div className="flex items-center justify-between mb-2">
                  <label className="text-xs font-semibold text-gray-600">Rincian Fitur Paket</label>
                  <button
                    type="button"
                    onClick={handleAddFeatureField}
                    className="text-xs font-semibold text-[#b38867] hover:underline"
                  >
                    + Tambah Fitur
                  </button>
                </div>

                <div className="space-y-2">
                  {formData.features.map((f, idx) => (
                    <div key={idx} className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        title="Tersedia di paket ini?"
                        checked={f.available}
                        onChange={(e) => handleFeatureChange(idx, "available", e.target.checked)}
                        className="rounded text-[#b38867] focus:ring-[#b38867] h-4 w-4"
                      />
                      <input
                        type="text"
                        placeholder="Contoh: Sertifikat Resmi"
                        value={f.text}
                        onChange={(e) => handleFeatureChange(idx, "text", e.target.value)}
                        className="flex-1 p-2 text-xs border border-gray-300 rounded-lg focus:ring-1 focus:ring-[#b38867] outline-none"
                      />
                      {formData.features.length > 1 && (
                        <button
                          type="button"
                          onClick={() => handleRemoveFeatureField(idx)}
                          className="p-1.5 text-gray-400 hover:text-red-500 rounded-lg"
                        >
                          <X size={14} />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-4 flex items-center justify-end gap-3 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 text-xs text-gray-600 hover:bg-gray-100 rounded-xl transition"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-5 py-2.5 text-xs font-semibold text-white bg-[#b38867] hover:bg-[#a27355] rounded-xl transition disabled:opacity-50"
                >
                  {submitting ? "Menyimpan..." : "Simpan Paket"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default SubscriptionPlansAdmin;
