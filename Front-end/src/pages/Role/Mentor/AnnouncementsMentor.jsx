import React, { useState, useEffect } from "react";
import Button from "../../../components/Button";
import axios from "axios";
import { useAuth } from "../../../context/useAuth";

export default function Announcements() {
  const { user } = useAuth();
  const [announcements, setAnnouncements] = useState([]);

  const fetchAnnouncements = async () => {
    try {
      const res = await axios.get("http://localhost:8000/api/announcements");
      setAnnouncements(res.data);
    } catch (err) {
      console.error("Error fetching announcements:", err);
    }
  };

  useEffect(() => {
    fetchAnnouncements();
  }, []);

  const canCreate =
    user?.role === "admin" || user?.role === "mentor"; // Admin dan Mentor boleh membuat

  return (
    <div className="w-full p-6">
      <div className="border rounded-xl p-6 w-full min-h-[450px] relative">

        {/* Tombol + di kanan atas */}
        {canCreate && (
          <div className="absolute right-4 top-4">
            <Button onClick={() => console.log("create announcement")}>
              +
            </Button>
          </div>
        )}

        {/* Judul */}
        <h1 className="text-2xl font-semibold mb-4">Announcements</h1>

        {/* Jika kosong */}
        {announcements.length === 0 ? (
          <p className="text-gray-500">
            Belum ada pengumuman yang diposting.
          </p>
        ) : (
          <div className="space-y-4">
            {announcements.map((item) => (
              <div
                key={item.id}
                className="border rounded-lg p-4 shadow-sm bg-white"
              >
                <h2 className="text-lg font-medium">{item.title}</h2>
                <p className="text-gray-700 mt-1">{item.message}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
