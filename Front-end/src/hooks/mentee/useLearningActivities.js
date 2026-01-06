import { useEffect, useState, useCallback } from "react";
import api, { getCsrfCookie } from "../../axiosInstance";

export default function useMenteeMaterials() {
  const [materials, setMaterials] = useState([]);
  const [progress, setProgress] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchMaterials = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      await getCsrfCookie();

      const [materialsRes, progressRes] = await Promise.all([
        api.get("/api/mentee/materials"),
        api.get("/api/mentee/material-progress"),
      ]);

      setMaterials(materialsRes.data?.data || []);
      setProgress(progressRes.data?.data || []);
    } catch (err) {
      console.error(err);
      setError("Gagal memuat materi");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchMaterials();
  }, [fetchMaterials]);

  return {
    materials,
    progress,
    loading,
    error,
    refetch: fetchMaterials,
  };
}
