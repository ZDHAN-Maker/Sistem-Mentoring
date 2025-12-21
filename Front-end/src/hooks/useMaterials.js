import { useState, useEffect, useCallback } from "react";
import api, { getCsrfCookie } from "../axiosInstance";

export default function useMaterials() {
  const [materials, setMaterials] = useState([]);
  const [activeMaterialId, setActiveMaterialId] = useState(null);
  const [activeVideo, setActiveVideo] = useState(null);
  const [loading, setLoading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [errors, setErrors] = useState({});

  const fetchMaterials = useCallback(async () => {
    try {
      const res = await api.get("/api/materials");

      const list = res.data?.data ?? [];
      setMaterials(list);

      const savedId = localStorage.getItem("active_material_id");
      const active =
        list.find((m) => m.id === Number(savedId)) || list[0] || null;

      if (active) {
        setActiveMaterialId(active.id);
        setActiveVideo(active.video_url);
      }
    } catch (err) {
      console.error("❌ Fetch error:", err.response?.data ?? err.message);
    }
  }, []);

  useEffect(() => {
    (async () => {
      await getCsrfCookie();
      fetchMaterials();
    })();
  }, [fetchMaterials]);

  useEffect(() => {
    if (activeMaterialId) {
      localStorage.setItem("active_material_id", activeMaterialId);
    }
  }, [activeMaterialId]);

  const selectMaterial = (material) => {
    setActiveMaterialId(material.id);
    setActiveVideo(material.video_url);
    localStorage.setItem("active_material_id", material.id);
  };

  const saveMaterial = async (
    formData,
    editMode = false,
    materialId = null
  ) => {
    setLoading(true);
    setErrors({});
    setUploadProgress(0);

    const data = new FormData();

    Object.entries(formData).forEach(([key, val]) => {
      if (val === null || val === undefined) return;

      // 🔥 FIX PENTING
      if (key === "video_file" || key === "video_path") {
        data.append("video", val); // HARUS "video"
      } else {
        data.append(key, val);
      }
    });

    try {
      const config = {
        withCredentials: true,
        onUploadProgress: (p) => {
          if (p.total) {
            setUploadProgress(Math.round((p.loaded * 100) / p.total));
          }
        },
      };

      const res = editMode
        ? await api.post(
            `/api/materials/${materialId}?_method=PUT`,
            data,
            config
          )
        : await api.post(`/api/materials`, data, config);

      await fetchMaterials();
      setLoading(false);
      setUploadProgress(0);

      return res.data?.data ?? null;
    } catch (err) {
      setLoading(false);
      setUploadProgress(0);

      if (err.response?.status === 422) {
        setErrors(err.response.data.errors ?? {});
        return { error: "validation" };
      }

      console.error("❌ Save error:", err.response?.data ?? err.message);
      return { error: "server" };
    }
  };

  const deleteMaterial = async (materialId) => {
    try {
      await api.delete(`/api/materials/${materialId}`, {
        withCredentials: true,
      });

      await fetchMaterials();
      return true;
    } catch (err) {
      console.error("❌ Delete error:", err.response?.data ?? err.message);
      return { error: "server" };
    }
  };

  return {
    materials,
    activeMaterialId,
    activeVideo,
    loading,
    uploadProgress,
    errors,
    fetchMaterials,
    saveMaterial,
    selectMaterial,
    deleteMaterial,
  };
}
