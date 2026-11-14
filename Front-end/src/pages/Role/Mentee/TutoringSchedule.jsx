import React, { useState, useEffect } from "react";
import api from "../../../axiosInstance";
import { 
  Calendar as CalendarIcon, 
  Clock, 
  Video, 
  MapPin, 
  ExternalLink, 
  RefreshCw, 
  CheckCircle2, 
  AlertCircle,
  UserCheck
} from "lucide-react";

export default function TutoringSchedule() {
  const [schedules, setSchedules] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [filter, setFilter] = useState("all"); // 'all', 'upcoming', 'past'

  const fetchSchedules = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await api.get("/schedules");
      setSchedules(res.data?.data || res.data || []);
    } catch (err) {
      console.error("Gagal memuat jadwal mentoring:", err);
      setError("Gagal memuat jadwal bimbingan.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSchedules();
  }, []);

  const now = new Date();

  const filteredSchedules = schedules.filter((sch) => {
    const end = new Date(sch.end_time || sch.start_time);
    if (filter === "upcoming") return end >= now;
    if (filter === "past") return end < now;
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Jadwal Bimbingan</h1>
          <p className="text-gray-500 text-sm mt-1">
            Informasi waktu sesi mentoring 1-on-1 maupun tatap muka langsung bersama pembimbing Anda.
          </p>
        </div>

        <button
          onClick={fetchSchedules}
          className="inline-flex items-center gap-2 px-3 py-2 text-sm text-gray-600 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 transition"
        >
          <RefreshCw size={16} className={loading ? "animate-spin" : ""} />
          Refresh
        </button>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-gray-200 gap-6">
        <button
          onClick={() => setFilter("all")}
          className={`pb-3 text-sm font-semibold border-b-2 transition-all ${
            filter === "all"
              ? "border-[#b38867] text-[#b38867]"
              : "border-transparent text-gray-500 hover:text-gray-700"
          }`}
        >
          Semua Jadwal ({schedules.length})
        </button>
        <button
          onClick={() => setFilter("upcoming")}
          className={`pb-3 text-sm font-semibold border-b-2 transition-all ${
            filter === "upcoming"
              ? "border-[#b38867] text-[#b38867]"
              : "border-transparent text-gray-500 hover:text-gray-700"
          }`}
        >
          Sesi Mendatang ({schedules.filter(s => new Date(s.end_time || s.start_time) >= now).length})
        </button>
        <button
          onClick={() => setFilter("past")}
          className={`pb-3 text-sm font-semibold border-b-2 transition-all ${
            filter === "past"
              ? "border-[#b38867] text-[#b38867]"
              : "border-transparent text-gray-500 hover:text-gray-700"
          }`}
        >
          Sesi Selesai ({schedules.filter(s => new Date(s.end_time || s.start_time) < now).length})
        </button>
      </div>

      {error && (
        <div className="p-4 bg-red-50 border border-red-200 text-red-700 rounded-xl flex items-center gap-3">
          <AlertCircle className="w-5 h-5 shrink-0" />
          <span className="text-sm">{error}</span>
        </div>
      )}

      {/* Schedule List */}
      {loading ? (
        <div className="space-y-4">
          {[1, 2, 3].map(i => (
            <div key={i} className="animate-pulse bg-white p-6 rounded-2xl border border-gray-100 h-28"></div>
          ))}
        </div>
      ) : filteredSchedules.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-2xl border border-dashed border-gray-300 p-8">
          <div className="w-16 h-16 bg-indigo-50 rounded-full flex items-center justify-center mx-auto mb-4 text-indigo-500">
            <CalendarIcon className="w-8 h-8 opacity-60" />
          </div>
          <h3 className="text-base font-semibold text-gray-800">
            {filter === "upcoming" ? "Tidak ada sesi mendatang" : "Belum ada jadwal sesi"}
          </h3>
          <p className="text-gray-500 text-sm mt-1 max-w-sm mx-auto">
            Mentor Anda akan menjadwalkan sesi bimbingan berikutnya sesuai progres pembelajaran.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredSchedules.map(sch => {
            const isUpcoming = new Date(sch.end_time || sch.start_time) >= now;
            return (
              <div
                key={sch.id}
                className="bg-white rounded-2xl border border-gray-200 p-5 shadow-xs hover:border-gray-300 transition-all flex flex-col justify-between"
              >
                <div className="space-y-3">
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="font-bold text-gray-800 text-base leading-snug">
                      {sch.title}
                    </h3>
                    <span
                      className={`shrink-0 px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                        isUpcoming
                          ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                          : "bg-gray-100 text-gray-600 border border-gray-200"
                      }`}
                    >
                      {isUpcoming ? "Mendatang" : "Telah Lewat"}
                    </span>
                  </div>

                  {sch.description && (
                    <p className="text-xs text-gray-600 leading-relaxed">
                      {sch.description}
                    </p>
                  )}

                  <div className="space-y-1.5 pt-2 border-t border-gray-100 text-xs text-gray-600">
                    <div className="flex items-center gap-2">
                      <Clock size={14} className="text-[#b38867]" />
                      <span>
                        {new Date(sch.start_time).toLocaleString("id-ID", {
                          weekday: "long",
                          day: "numeric",
                          month: "long",
                          year: "numeric",
                          hour: "2-digit",
                          minute: "2-digit"
                        })}{" "}
                        - {new Date(sch.end_time).toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" })} WIB
                      </span>
                    </div>

                    {sch.location && (
                      <div className="flex items-center gap-2">
                        <MapPin size={14} className="text-gray-400" />
                        <span>{sch.location}</span>
                      </div>
                    )}

                    {sch.pairing?.mentor && (
                      <div className="flex items-center gap-2">
                        <UserCheck size={14} className="text-gray-400" />
                        <span>Pembimbing: <strong className="text-gray-700">{sch.pairing.mentor.name}</strong></span>
                      </div>
                    )}
                  </div>
                </div>

                {sch.meeting_link && (
                  <div className="mt-4 pt-3 border-t border-gray-100 flex justify-end">
                    <a
                      href={sch.meeting_link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold rounded-xl shadow-xs transition"
                    >
                      <Video size={14} />
                      Gabung Sesi Meeting
                      <ExternalLink size={12} />
                    </a>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
