import React, { useState, useEffect } from "react";
import api from "../../../axiosInstance";
import { 
  Calendar as CalendarIcon, 
  Clock, 
  Video, 
  MapPin, 
  RefreshCw, 
  Search, 
  UserCheck 
} from "lucide-react";

const TutoringScheduleAdmin = () => {
  const [schedules, setSchedules] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  const fetchSchedules = async () => {
    setLoading(true);
    try {
      const res = await api.get("/schedules");
      setSchedules(res.data.data || res.data || []);
    } catch (err) {
      console.error("Gagal mengambil jadwal:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSchedules();
  }, []);

  const filteredSchedules = schedules.filter((s) => {
    const term = searchTerm.toLowerCase();
    const title = s.title?.toLowerCase() || "";
    const mentorName = s.mentor?.name?.toLowerCase() || "";
    return title.includes(term) || mentorName.includes(term);
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Jadwal Bimbingan Mentoring</h1>
          <p className="text-gray-500 text-sm mt-1">
            Pantau seluruh sesi jadwal bimbingan aktif antara mentor dan mentee.
          </p>
        </div>
        <button
          onClick={fetchSchedules}
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-white border border-gray-300 rounded-xl hover:bg-gray-50 text-gray-700 text-sm font-medium transition self-start sm:self-auto"
        >
          <RefreshCw size={16} />
          Refresh
        </button>
      </div>

      {/* Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-gray-200 shadow-sm flex items-center gap-3">
        <Search size={18} className="text-gray-400" />
        <input
          type="text"
          placeholder="Cari berdasarkan judul jadwal atau nama mentor..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full text-sm outline-none text-gray-700 placeholder-gray-400"
        />
        {searchTerm && (
          <button onClick={() => setSearchTerm("")} className="text-xs text-gray-400 hover:text-gray-600">
            Reset
          </button>
        )}
      </div>

      {/* Grid Kartu Jadwal */}
      {loading ? (
        <div className="p-12 flex items-center justify-center text-gray-500 bg-white rounded-2xl border border-gray-200">
          <RefreshCw className="animate-spin text-[#b38867] mr-3" size={20} />
          <span>Memuat jadwal bimbingan...</span>
        </div>
      ) : filteredSchedules.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredSchedules.map((sch) => (
            <div
              key={sch.id}
              className="bg-white p-5 rounded-2xl border border-gray-200 shadow-sm hover:shadow-md transition flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="px-3 py-1 bg-amber-50 text-amber-700 font-semibold text-xs rounded-full border border-amber-200">
                    {sch.status || "Scheduled"}
                  </span>
                  <span className="text-xs font-mono text-gray-400">#{sch.id}</span>
                </div>

                <h3 className="font-bold text-gray-800 text-base">{sch.title}</h3>
                <p className="text-gray-500 text-xs mt-1 line-clamp-2">
                  {sch.description || "Tidak ada deskripsi rinci."}
                </p>

                <div className="mt-4 space-y-2 text-xs text-gray-600">
                  <div className="flex items-center gap-2">
                    <CalendarIcon size={15} className="text-[#b38867]" />
                    <span>
                      {sch.schedule_date
                        ? new Date(sch.schedule_date).toLocaleDateString("id-ID", {
                            weekday: "short",
                            day: "numeric",
                            month: "short",
                            year: "numeric"
                          })
                        : "Tanggal belum diatur"}
                    </span>
                  </div>

                  {sch.start_time && (
                    <div className="flex items-center gap-2">
                      <Clock size={15} className="text-[#b38867]" />
                      <span>{sch.start_time} - {sch.end_time || "Selesai"}</span>
                    </div>
                  )}

                  {sch.meeting_link && (
                    <div className="flex items-center gap-2 text-blue-600">
                      <Video size={15} />
                      <a href={sch.meeting_link} target="_blank" rel="noreferrer" className="hover:underline truncate">
                        Link Meeting
                      </a>
                    </div>
                  )}
                </div>
              </div>

              <div className="pt-3 mt-4 border-t border-gray-100 flex items-center justify-between text-xs text-gray-400">
                <span>Mentor: {sch.mentor?.name || "Mentor"}</span>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="p-12 text-center bg-white rounded-2xl border border-gray-200 text-gray-400">
          <CalendarIcon size={36} className="mx-auto mb-2 text-gray-300" />
          <p className="text-sm">Belum ada jadwal bimbingan yang terdaftar.</p>
        </div>
      )}
    </div>
  );
};

export default TutoringScheduleAdmin;
