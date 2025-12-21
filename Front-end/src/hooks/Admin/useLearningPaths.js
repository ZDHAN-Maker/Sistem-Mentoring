import { useState, useEffect, useCallback } from "react";
import api from "../../axiosInstance";

export function useLearningPaths() {
  const [learningPaths, setLearningPaths] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchLearningPaths = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await api.get("/api/learning-paths");
      setLearningPaths(res.data.paths || []);
    } catch (err) {
      console.error("❌ Failed to fetch learning paths:", err);
      setError("Gagal mengambil data learning path");
    } finally {
      setLoading(false);
    }
  }, []);

  const getLearningPathDetail = async (id) => {
    try {
      const res = await api.get(`/api/learning-paths/${id}`);
      return res.data.data;
    } catch (err) {
      console.error("❌ Failed to get detail:", err);
      throw err;
    }
  };

  const createLearningPath = async (payload) => {
    try {
      const res = await api.post("/api/learning-paths", payload);
      await fetchLearningPaths();
      return res.data;
    } catch (err) {
      console.error("❌ Failed to create:", err);
      throw err;
    }
  };

  const updateLearningPath = async (id, payload) => {
    try {
      const res = await api.put(`/api/learning-paths/${id}`, payload);
      await fetchLearningPaths();
      return res.data;
    } catch (err) {
      console.error("❌ Failed to update:", err);
      throw err;
    }
  };

  const deleteLearningPath = async (id) => {
    try {
      await api.delete(`/api/learning-paths/${id}`);
      await fetchLearningPaths();
    } catch (err) {
      console.error("❌ Failed to delete:", err);
      throw err;
    }
  };

  /* ===================== MENTOR ===================== */

  const assignMentor = async (id, mentorId) => {
    try {
      const res = await api.post(
        `/api/learning-paths/${id}/assign-mentor`,
        { mentor_id: mentorId }
      );
      await fetchLearningPaths();
      return res.data;
    } catch (err) {
      console.error("❌ Failed to assign mentor:", err);
      throw err;
    }
  };

  const removeMentor = async (id, mentorId) => {
    try {
      const res = await api.delete(
        `/api/learning-paths/${id}/mentor/${mentorId}`
      );
      await fetchLearningPaths();
      return res.data;
    } catch (err) {
      console.error("❌ Failed to remove mentor:", err);
      throw err;
    }
  };

  const replaceMentor = async (id, oldId, newId) => {
    try {
      const res = await api.put(
        `/api/learning-paths/${id}/replace-mentor`,
        {
          old_mentor_id: oldId,
          new_mentor_id: newId,
        }
      );
      await fetchLearningPaths();
      return res.data;
    } catch (err) {
      console.error("❌ Failed to replace mentor:", err);
      throw err;
    }
  };

  /* ===================== MENTEE ===================== */

  const assignMentee = async (id, menteeId) => {
    try {
      const res = await api.post(
        `/api/learning-paths/${id}/assign-mentee`,
        { mentee_id: menteeId }
      );
      await fetchLearningPaths();
      return res.data;
    } catch (err) {
      console.error("❌ Failed to assign mentee:", err);
      throw err;
    }
  };

  useEffect(() => {
    fetchLearningPaths();
  }, [fetchLearningPaths]);

  return {
    learningPaths,
    loading,
    error,
    createLearningPath,
    updateLearningPath,
    deleteLearningPath,
    assignMentor,
    assignMentee,
    removeMentor,
    replaceMentor,
    getLearningPathDetail,
    refresh: fetchLearningPaths,
  };
}
