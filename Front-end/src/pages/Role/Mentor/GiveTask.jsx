import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import InputField from "../../../components/InputField";
import Button from "../../../components/Button";
import { useAuth } from "../../../context/useAuth";

export default function MaterialManager() {
  const { user } = useAuth();
  const token = user?.token;

  const [materials, setMaterials] = useState([]);
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

  // --------------------------------------------------------
  // FETCH MATERIALS AMAN
  // --------------------------------------------------------
  const fetchMaterials = useCallback(async () => {
    if (!token) return; // Jika token belum siap, jangan fetch dulu

    try {
      const res = await axios.get("/api/materials", {
        headers: { Authorization: `Bearer ${token}` },
      });

      // fallback struktur API
      const result =
        Array.isArray(res.data?.data) ? res.data.data :
          Array.isArray(res.data) ? res.data :
            [];

      setMaterials(result);
    } catch (err) {
      console.error("Error fetching materials:", err);
      setMaterials([]); // biar tidak undefined
    }
  }, [token]);

  useEffect(() => {
    fetchMaterials();
  }, [fetchMaterials]);

  // --------------------------------------------------------
  // FORM HANDLER
  // --------------------------------------------------------
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
    setFormData({
      title: "",
      description: "",
      status: "draft",
      video: null,
    });
    setModalOpen(true);
  };

  const openEditModal = (material) => {
    setEditMode(true);
    setSelectedMaterial(material);
    setFormData({
      title: material.title,
      description: material.description,
      status: material.status,
      video: null,
    });
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setErrors({});
    setUploadProgress(0);
  };

  // --------------------------------------------------------
  // SUBMIT MATERIAL
  // --------------------------------------------------------
  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});

    if (!formData.title.trim()) {
      setErrors({ title: "Judul harus diisi" });
      return;
    }

    if (!editMode && !formData.video) {
      setErrors({ video: "Video harus diupload" });
      return;
    }

    setLoading(true);
    setUploadProgress(0);

    const data = new FormData();
    data.append("title", formData.title);
    data.append("description", formData.description);
    data.append("status", formData.status);
    if (formData.video) data.append("video", formData.video);

    try {
      const url = editMode
        ? `/api/materials/${selectedMaterial.id}`
        : "/api/materials";

      await axios.post(url, data, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
        onUploadProgress: (evt) => {
          const percent = Math.round((evt.loaded * 100) / evt.total);
          setUploadProgress(percent);
        },
      });

      alert(editMode ? "Material berhasil diperbarui!" : "Material berhasil ditambahkan!");
      fetchMaterials();
      closeModal();
    } catch (err) {
      console.error("Error:", err);
      setErrors(err.response?.data?.errors || {});
      alert("Gagal menyimpan data");
    } finally {
      setLoading(false);
      setUploadProgress(0);
    }
  };

  // --------------------------------------------------------
  // RENDER
  // --------------------------------------------------------
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">

      {/* VIDEO PLAYER */}
      <div className="col-span-3 w-full bg-black/5 rounded-xl border h-[400px] flex items-center justify-center">
        <button className="w-20 h-20 rounded-full border flex items-center justify-center hover:bg-black/10 transition">
          <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path d="M18 15L30 24L18 33V15Z" />
          </svg>
        </button>
      </div>

      {/* SIDEBAR LIST LESSONS */}
      <div className="bg-white border rounded-xl p-4 h-fit">
        <h3 className="font-semibold text-sm mb-3">List Materials</h3>

        <Button
          onClick={openCreateModal}
          className="w-full mb-3"
        >
          + Upload Material
        </Button>

        {Array.isArray(materials) && materials.length > 0 ? (
          <div className="flex flex-col gap-2">
            {materials.map((item) => (
              <div
                key={item.id}
                onClick={() => openEditModal(item)}
                className="flex items-center gap-2 bg-[#c8ad90] text-black px-3 py-2 rounded-lg cursor-pointer hover:bg-[#b89c82] transition"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" stroke="currentColor">
                  <path d="M18 12L6 4V20L18 12Z" fill="none" strokeWidth="1.5" />
                </svg>

                <span className="text-sm">{item.title}</span>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500 text-sm">Belum ada material.</p>
        )}
      </div>

      {/* ---------------- Modal ---------------- */}
      {modalOpen && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-xl w-96 shadow-lg">

            <h3 className="text-lg mb-3 font-semibold">
              {editMode ? "Edit Material" : "Upload Material Baru"}
            </h3>

            <form onSubmit={handleSubmit}>

              <InputField
                label="Judul"
                name="title"
                value={formData.title}
                onChange={handleChange}
                error={errors.title}
              />

              <InputField
                label="Deskripsi"
                name="description"
                value={formData.description}
                onChange={handleChange}
              />

              <InputField
                label="Status"
                name="status"
                value={formData.status}
                onChange={handleChange}
              />

              <div className="mt-2">
                <label className="block mb-1">Upload Video</label>
                <input
                  type="file"
                  name="video"
                  onChange={handleChange}
                  className="text-sm"
                />
                {errors.video && (
                  <p className="text-red-500 text-sm mt-1">{errors.video}</p>
                )}
              </div>

              {loading && (
                <div className="mt-3 w-full bg-gray-200 rounded h-3">
                  <div
                    className="bg-blue-500 h-3 rounded"
                    style={{ width: `${uploadProgress}%` }}
                  ></div>
                </div>
              )}

              <div className="flex justify-end mt-4 gap-2">
                <Button type="button" variant="secondary" onClick={closeModal}>
                  Batal
                </Button>
                <Button type="submit" loading={loading}>
                  Simpan
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );

}
