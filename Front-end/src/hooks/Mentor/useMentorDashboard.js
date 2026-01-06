import { useEffect, useState } from "react";
import api, { getCsrfCookie } from "../../axiosInstance";

const useMentorDashboard = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [dashboard, setDashboard] = useState(null);
  const [mentees, setMentees] = useState([]);
  const [upcomingSchedule, setUpcomingSchedule] = useState([]);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        await getCsrfCookie();
        const res = await api.get("/api/mentor/dashboard");

        const { dashboard, pairings } = res.data;

        //List mentee
        const menteeNames = pairings.map((p) => p.mentee?.name);

        //Upcoming schedules
        const schedules = pairings
          .flatMap((p) =>
            (p.schedules || []).map((s) => ({
              ...s,
              menteeName: p.mentee?.name,
            }))
          )
          .filter((s) => s.start_time) // penting
          .sort((a, b) => new Date(a.start_time) - new Date(b.start_time))
          .slice(0, 5);

        setDashboard(dashboard);
        setMentees(menteeNames);
        setUpcomingSchedule(schedules);
      } catch (err) {
        console.error(err);
        setError(
          err.response?.data?.message || "Gagal memuat dashboard mentor"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchDashboard();
  }, []);

  return {
    loading,
    error,
    dashboard,
    mentees,
    upcomingSchedule,
  };
};

export default useMentorDashboard;
