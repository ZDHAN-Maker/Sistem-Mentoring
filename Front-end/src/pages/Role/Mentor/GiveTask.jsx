import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import InputField from "../../../components/InputField";
import Button from "../../../components/Button";
import { useAuth } from "../../../context/useAuth";

export default function MaterialManager() {
  const { user } = useAuth();
  const token = user?.token; // ambil token dari user

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
    <div>
      <h2 className="text-xl font-semibold mb-4">Manajemen Materials</h2>

      <Button onClick={openCreateModal}>+ Tambah Material</Button>

      <div className="mt-4">
        {Array.isArray(materials) && materials.length > 0 ? (
          materials.map((item) => (
            <div key={item.id} className="border p-3 rounded mb-2 flex justify-between">
              <div>
                <p className="font-semibold">{item.title}</p>
                <p className="text-sm text-gray-600">{item.status}</p>
              </div>
              <Button onClick={() => openEditModal(item)}>Edit</Button>
            </div>
          ))
        ) : (
          <p className="text-gray-500">Belum ada material.</p>
        )}
      </div>

      {/* Modal */}
      {modalOpen && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center">
          <div className="bg-white p-6 rounded w-96">

            <h3 className="text-lg mb-3">
              {editMode ? "Edit Material" : "Tambah Material"}
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
                <input type="file" name="video" onChange={handleChange} />

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
                <Button type="button" onClick={closeModal} variant="secondary">
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
