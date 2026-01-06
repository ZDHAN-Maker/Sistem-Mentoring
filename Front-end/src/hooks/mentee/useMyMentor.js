import { useEffect, useState } from "react";
import api, { getCsrfCookie } from "../../axiosInstance";

export default function useMyMentor() {
  const [pairing, setPairing] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadMyMentor = async () => {
      try {
        await getCsrfCookie();

        const res = await api.get("/api/mentee/my-mentor");
        setPairing(res.data.data);
      } catch (err) {
        console.error(
          "My mentor error:",
          err.response?.status,
          err.response?.data || err
        );
      } finally {
        setLoading(false);
      }
    };

    loadMyMentor();
  }, []);

  return {
    pairing,
    mentor: pairing?.mentor ?? null,
    loading,
  };
}
