import { useEffect, useState, useCallback } from "react";
import api from "../../axiosInstance";

export default function useLearningActivities() {
  const [activities, setActivities] = useState([]);
  const [materials, setMaterials] = useState([]);
  const [selectedActivity, setSelectedActivity] = useState(null);

  const [loadingActivities, setLoadingActivities] = useState(true);
  const [loadingMaterials, setLoadingMaterials] = useState(false);
  const [error, setError] = useState(null);

  const fetchActivities = useCallback(async () => {
    try {
      setError(null);
      const res = await api.get("/mentee/learning-activities");
      setActivities(res.data.data || []);
    } catch (e) {
      console.error(e);
      setError("Gagal mengambil aktivitas pembelajaran");
    } finally {
      setLoadingActivities(false);
    }
  }, []);

  const fetchMaterials = useCallback(async (activityId) => {
    try {
      setError(null);
      setSelectedActivity(activityId);
      setMaterials([]);
      setLoadingMaterials(true);

      const res = await api.get(
        `/mentee/learning-activities/${activityId}/materials`
      );

      setMaterials(res.data.data || []);
    } catch (e) {
      console.error(e);
      setError("Gagal mengambil materi");
    } finally {
      setLoadingMaterials(false);
    }
  }, []);

  useEffect(() => {
    fetchActivities();
  }, [fetchActivities]);

  return {
    activities,
    materials,
    selectedActivity,
    loadingActivities,
    loadingMaterials,
    error,
    fetchMaterials,
  };
}
