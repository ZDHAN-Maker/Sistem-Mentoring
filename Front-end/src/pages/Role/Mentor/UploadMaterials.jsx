import React, { useState, useEffect, useCallback } from "react";
import InputField from "../../../components/InputField";
import Button from "../../../components/Button";
import { useAuth } from "../../../context/useAuth";
import api from "../../../axiosInstance";

export default function MaterialManager() {
  const { user } = useAuth();
  const token = user?.token;

  const [materials, setMaterials] = useState([]);
  const [activeVideo, setActiveVideo] = useState(null);
  const [loading, setLoading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [errors, setErrors] = useState({});
  const [modalOpen, setModalOpen] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [selectedMaterial, setSelectedMaterial] = useState(null);

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    status: "draft",
    video: null,
  });

  // Convert backend "video_path" menjadi URL publik
  const getVideoUrl = (path) => {
    if (!path) return null;
    return `http://localhost:8000/storage/${path}`;
  };

  // ======================================================
  // FETCH MATERIALS
  // ======================================================
  const fetchMaterials = useCallback(async () => {
    if (!token) return;
    try {
      const res = await api.get("/materials", {
        headers: { Authorization: `Bearer ${token}` },
      });

      const list = res.data?.data ?? [];

      // Tambahkan properti video_url agar mudah digunakan
      const updated = list.map((m) => ({
        ...m,
        video_url: getVideoUrl(m.video_path),
      }));

      setMaterials(updated);

      if (updated.length > 0) {
        setActiveVideo(updated[0].video_url);
      }

    } catch (err) {
      console.error("Error fetching materials:", err);
      setMaterials([]);
    }
  }, [token]);

  useEffect(() => {
    fetchMaterials();
  }, [fetchMaterials]);

  // ======================================================
  // FORM HANDLER
  // ======================================================
  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: files ? files[0] : value,
    }));
  };

  const openCreateModal = () => {
    setEditMode(false);
    setSelectedMaterial(null);
    setFormData({ title: "", description: "", status: "draft", video: null });
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setErrors({});
    setUploadProgress(0);
  };

  // ======================================================
  // SUBMIT MATERIAL
  // ======================================================
  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});
    setLoading(true);

    let data = new FormData();
    data.append("title", formData.title);
    data.append("description", formData.description);
    data.append("status", formData.status);
    if (formData.video instanceof File) {
      data.append("video", formData.video);
    }

    try {
      let response;

      if (editMode) {
        response = await api.put(`/materials/${selectedMaterial.id}`, data, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
          onUploadProgress: (p) =>
            setUploadProgress(Math.round((p.loaded * 100) / p.total)),
        });
      } else {
        response = await api.post(`/materials`, data, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
          onUploadProgress: (p) =>
            setUploadProgress(Math.round((p.loaded * 100) / p.total)),
        });
      }

      const newMaterial = {
        ...response.data.data,
        video_url: getVideoUrl(response.data.data.video_path),
      };

      if (!editMode) {
        setMaterials((prev) => [...prev, newMaterial]);
        setActiveVideo(newMaterial.video_url);
      } else {
        setMaterials((prev) =>
          prev.map((m) => (m.id === newMaterial.id ? newMaterial : m))
        );
      }

      alert(editMode ? "Material diperbarui!" : "Material diupload!");
      closeModal();

    } catch (err) {
      console.error("422 ERROR:", err.response?.data);
      setErrors(err.response?.data?.errors || {});
      alert("Gagal menyimpan data");
    } finally {
      setLoading(false);
    }
  };

  // ======================================================
  // UI
  // ======================================================
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">

      {/* VIDEO PLAYER */}
      <div className="col-span-3 w-full bg-black rounded-xl border h-[400px] flex items-center justify-center">
        {activeVideo ? (
          <video
            src={activeVideo}
            controls
            className="w-full h-full rounded-xl object-cover"
          />
        ) : (
          <p className="text-gray-300 text-sm">Pilih materi untuk diputar...</p>
        )}
      </div>

      {/* SIDEBAR LIST */}
      <div className="bg-white border rounded-xl p-4 h-fit">
        <h3 className="font-semibold text-sm mb-3">List Materials</h3>

        <Button onClick={openCreateModal} className="w-full mb-3">
          + Upload Material
        </Button>

        {materials.length > 0 ? (
          <div className="flex flex-col gap-2">
            {materials.map((item) => (
              <div
                key={item.id}
                onClick={() => setActiveVideo(item.video_url)}
                className="flex items-center gap-2 bg-[#c8ad90] text-black px-3 py-2 rounded-lg cursor-pointer hover:bg-[#b89c82] transition"
              >
                ▶
                <span className="text-sm">{item.title}</span>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500 text-sm">Belum ada material.</p>
        )}
      </div>

      {/* MODAL */}
      {modalOpen && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-xl w-96 shadow-lg">

            <h3 className="text-lg mb-3 font-semibold">
              {editMode ? "Edit Material" : "Upload Material Baru"}
            </h3>

            <form onSubmit={handleSubmit}>
              <InputField label="Judul" name="title" value={formData.title} onChange={handleChange} />
              <InputField label="Deskripsi" name="description" value={formData.description} onChange={handleChange} />
              <InputField label="Status" name="status" value={formData.status} onChange={handleChange} />

              <label className="block mt-3">Upload Video</label>
              <input type="file" name="video" onChange={handleChange} />

              {loading && (
                <div className="mt-3 w-full bg-gray-200 rounded h-3">
                  <div className="bg-blue-500 h-3 rounded" style={{ width: `${uploadProgress}%` }}></div>
                </div>
              )}

              <div className="flex justify-end mt-4 gap-2">
                <Button type="button" variant="secondary" onClick={closeModal}>Batal</Button>
                <Button type="submit" loading={loading}>Simpan</Button>
              </div>
            </form>

          </div>
        </div>
      )}

    </div>
  );
}
