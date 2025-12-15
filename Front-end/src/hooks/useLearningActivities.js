// src/hooks/useLearningActivities.js
import { useEffect, useState } from "react";
import api from "../axiosInstance";

export default function useLearningActivities() {
  const [activities, setActivities] = useState([]);
  const [materials, setMaterials] = useState([]);
  const [selectedActivity, setSelectedActivity] = useState(null);

  const [loadingActivities, setLoadingActivities] = useState(false);
  const [loadingMaterials, setLoadingMaterials] = useState(false);
  const [error, setError] = useState(null);

  /**
   * Fetch all learning activities
   */
  const fetchActivities = async () => {
    try {
      setLoadingActivities(true);
      const res = await api.get("/learning-activities/activities");
      setActivities(res.data.data ?? []);
    } catch (err) {
      setError("Gagal mengambil aktivitas pembelajaran");
      console.error(err);
    } finally {
      setLoadingActivities(false);
    }
  };

  /**
   * Fetch materials by activity ID
   */
  const fetchMaterials = async (activityId) => {
    try {
      setLoadingMaterials(true);
      setSelectedActivity(activityId);

      const res = await api.get(
        `/learning-activities/activities/${activityId}/materials`
      );

      setMaterials(res.data.data ?? []);
    } catch (err) {
      setError("Gagal mengambil materi aktivitas");
      console.error(err);
    } finally {
      setLoadingMaterials(false);
    }
  };

  /**
   * Auto fetch activities on mount
   */
  useEffect(() => {
    fetchActivities();
  }, []);

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
