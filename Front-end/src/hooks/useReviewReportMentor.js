// hooks/useDashboard.js
import axios from "axios";
import { useEffect, useState } from "react";

export function useMentorDashboard(mentorId) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios
      .get(`/api/mentor/${mentorId}/dashboard`)
      .then((res) => setData(res.data.data))
      .finally(() => setLoading(false));
  }, [mentorId]);

  return { data, loading };
}
