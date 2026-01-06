import { useEffect, useState } from "react";
import api from "../../axiosInstance";

const useMentorMentees = () => {
  const [mentees, setMentees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchMentees = async () => {
      try {
        setLoading(true);

        const res = await api.get("/api/mentor/mentees");

        setMentees(res.data || []);
      } catch (err) {
        setError(
          err.response?.data?.message ||
          err.message ||
          "Gagal mengambil data mentee"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchMentees();
  }, []);

  return { mentees, loading, error };
};

export default useMentorMentees;
