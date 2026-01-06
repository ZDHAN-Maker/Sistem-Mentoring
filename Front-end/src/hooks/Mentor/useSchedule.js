import { useEffect, useState } from "react";
import api from "../../axiosInstance";

const useSchedule = () => {
  const [pairings, setPairings] = useState([]);
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  /* ================= FETCH ================= */
  const fetchSchedules = async () => {
    try {
      setLoading(true);

      const res = await api.get("/api/mentor/dashboard");
      const pairingsData = res.data?.pairings || [];

      setPairings(pairingsData);

      // 🔥 flatten schedules
      const flattenedEvents = pairingsData.flatMap((pairing) =>
        (pairing.schedules || []).map((schedule) => ({
          id: schedule.id,
          pairingId: pairing.id,
          menteeName: pairing.mentee?.name,
          startTime: schedule.start_time,
          endTime: schedule.end_time,
          status: schedule.status,
        }))
      );

      setEvents(flattenedEvents);
    } catch (err) {
      setError(
        err.response?.data?.message ||
          err.message ||
          "Gagal mengambil jadwal mentoring"
      );
    } finally {
      setLoading(false);
    }
  };

  /* ================= CREATE ================= */
  const createSchedule = async ({ pairing_id, date, time }) => {
    const start_time = `${date} ${time}:00`;

    await api.post("/api/mentors/schedule", {
      pairing_id,
      start_time,
    });

    await fetchSchedules();
  };

  /* ================= UPDATE ================= */
  const updateSchedule = async (id, payload) => {
    // payload contoh:
    // { start_time: "2025-12-25 13:00:00", status: "ongoing" }

    await api.put(`/api/mentors/schedule/${id}`, payload);
    await fetchSchedules();
  };

  /* ================= DELETE ================= */
  const deleteSchedule = async (id) => {
    await api.delete(`/api/mentors/schedule/${id}`);
    await fetchSchedules();
  };

  useEffect(() => {
    fetchSchedules();
  }, []);

  return {
    pairings,
    events,
    loading,
    error,
    createSchedule,
    updateSchedule,
    deleteSchedule,
    refetch: fetchSchedules,
  };
};

export default useSchedule;
