// hooks/useGiveTask.js
import { useEffect, useState } from "react";
import axios from "../../axiosInstance";

export const useGiveTask = () => {
  const [mentees, setMentees] = useState([]);
  const [pairings, setPairings] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        setLoading(true);
        setError(null);

        const res = await axios.get("/api/mentor/dashboard");

        const pairingsData = res.data?.pairings || [];

        setPairings(pairingsData);

        setMentees(pairingsData.map((p) => p.mentee).filter(Boolean));
      } catch (err) {
        console.error("Gagal mengambil data dashboard mentor", err);
        setError("Gagal mengambil data mentor");
      } finally {
        setLoading(false);
      }
    };

    fetchDashboard();
  }, []);

  const giveTask = async (form) => {
    if (!form.pairing_id) {
      throw new Error("Pairing belum dipilih");
    }

    const data = new FormData();
    data.append("pairing_id", form.pairing_id);
    data.append("judul", form.judul);
    data.append("deskripsi", form.deskripsi || "");
    data.append("type", form.type);

    if (form.type === "file" && form.file_path) {
      data.append("file", form.file_path);
    }

    if (form.type === "link" || form.type === "video") {
      data.append("link_url", form.link_url);
    }

    return axios.post("/api/mentor/tasks", data, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
  };

  return {
    mentees,
    pairings,
    giveTask,
    loading,
    error,
  };
};
