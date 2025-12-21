import { useEffect, useState } from "react";
import api, { getCsrfCookie } from "../../axiosInstance";

export const useAdminPairing = () => {
  const [pairings, setPairings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  /** GET ALL PAIRINGS */
  const fetchPairings = async () => {
    try {
      await getCsrfCookie();
      const res = await api.get("/api/pairings");

      // pastikan response ada
      setPairings(res.data.data || []);
    } catch (err) {
      console.error("Fetch pairing error:", err.response?.data || err);
      setError("Gagal mengambil pairing");
    } finally {
      setLoading(false);
    }
  };

  /** CREATE PAIRING */
  const createPairing = async (mentorId, menteeId) => {
    try {
      await getCsrfCookie();
      await api.post("/api/pairings", {
        mentor_id: mentorId,
        mentee_id: menteeId,
      });

      fetchPairings();
    } catch (err) {
      console.error("Create pairing error:", err.response?.data || err);
      throw err;
    }
  };

  /** DELETE PAIRING */
  const deletePairing = async (pairingId) => {
    if (!window.confirm("Yakin ingin menghapus pairing ini?")) return;

    try {
      await getCsrfCookie();
      await api.delete(`/api/admin/pairings/${pairingId}`);
      fetchPairings();
    } catch (err) {
      console.error("Delete pairing error:", err.response?.data || err);
      alert("Gagal menghapus pairing");
    }
  };

  useEffect(() => {
    fetchPairings();
  }, []);

  return {
    pairings,
    loading,
    error,
    createPairing,
    deletePairing,
  };
};
