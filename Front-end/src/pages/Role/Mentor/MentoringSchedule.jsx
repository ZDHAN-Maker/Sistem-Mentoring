import React, { useState } from "react";
import Sidebar from "../../../components/Sidebar";
import Navbar from "../../../components/Navbar";
import { Calendar } from "react-calendar";
import "react-calendar/dist/Calendar.css";

export default function MentoringSchedule() {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [showModal, setShowModal] = useState(false);
  const [eventTitle, setEventTitle] = useState("");
  const [eventTime, setEventTime] = useState("");
  const [eventStatus, setEventStatus] = useState("Belum Dimulai"); // default status

  const [events, setEvents] = useState(() => {
    const saved = localStorage.getItem("mentor-events");
    return saved ? JSON.parse(saved) : [];
  });

  React.useEffect(() => {
    localStorage.setItem("mentor-events", JSON.stringify(events));
  }, [events]);

  const handleCreateEvent = () => {
    const newEvent = {
      date: selectedDate.toDateString(),
      title: eventTitle,
      time: eventTime,
      status: eventStatus,
    };
    setEvents([...events, newEvent]);
    setEventTitle("");
    setEventTime("");
    setEventStatus("Belum Dimulai");
    setShowModal(false);
  };

  // Fungsi untuk menentukan warna berdasarkan status
  const statusColor = (status) => {
    switch (status) {
      case "Selesai":
        return "bg-green-200 text-green-800";
      case "Belum Dimulai":
        return "bg-gray-200 text-gray-800";
      case "Tidak Selesai":
        return "bg-red-200 text-red-800";
      default:
        return "bg-gray-200 text-gray-800";
    }
  };

  return (
    <div className="flex bg-[#f8fafc] min-h-screen">
      <div className="flex-1 p-8">
        <h1 className="text-3xl font-semibold mb-6">Mentoring Schedule</h1>

        {/* Kalender di atas */}
        <div className="bg-white p-6 rounded-2xl shadow-md border mb-8">
          <Calendar
            onChange={(date) => {
              setSelectedDate(date);
              setShowModal(true);
            }}
            value={selectedDate}
            className="w-full text-lg custom-calendar"
          />
        </div>

        {/* Jadwal Mentor di bawah */}
        <div className="bg-white p-6 rounded-2xl shadow-md border">
          <h2 className="text-xl font-semibold mb-4">Jadwal Mentor</h2>

          {events.length === 0 ? (
            <p className="text-gray-500">Belum ada acara</p>
          ) : (
            <ul className="space-y-4">
              {events.map((ev, idx) => (
                <li
                  key={idx}
                  className={`p-4 border rounded-xl shadow-sm hover:bg-gray-100 transition ${statusColor(
                    ev.status
                  )}`}
                >
                  <p className="font-semibold text-lg">{ev.title}</p>
                  <p className="text-sm">
                    {ev.date} — {ev.time} | Status: {ev.status}
                  </p>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 backdrop-blur-sm bg-black/20 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-2xl shadow-2xl w-96 border">
            <h3 className="text-xl font-semibold mb-4">Buat Acara</h3>

            <label className="block text-sm mb-1">Judul Acara</label>
            <input
              type="text"
              className="w-full p-3 border rounded-lg mb-4 focus:border-blue-500 focus:ring"
              value={eventTitle}
              onChange={(e) => setEventTitle(e.target.value)}
              placeholder="Contoh: Meeting, Review Progress"
            />

            <label className="block text-sm mb-1">Waktu</label>
            <input
              type="time"
              className="w-full p-3 border rounded-lg mb-4 focus:border-blue-500 focus:ring"
              value={eventTime}
              onChange={(e) => setEventTime(e.target.value)}
            />

            <label className="block text-sm mb-1">Status</label>
            <select
              className="w-full p-3 border rounded-lg mb-4 focus:border-blue-500 focus:ring"
              value={eventStatus}
              onChange={(e) => setEventStatus(e.target.value)}
            >
              <option value="Belum Dimulai">Belum Dimulai</option>
              <option value="Selesai">Selesai</option>
              <option value="Tidak Selesai">Tidak Selesai</option>
            </select>

            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300 transition"
              >
                Batal
              </button>
              <button
                onClick={handleCreateEvent}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
              >
                Simpan
              </button>
            </div>
          </div>
        </div>
      )}

      <style>{`
        .custom-calendar {
          font-size: 1.2rem;
        }
        .react-calendar {
          padding: 30px;
          border-radius: 20px;
          border: 1px solid #e5e7eb;
        }
        .react-calendar__tile {
          padding: 20px !important;
        }
        .react-calendar__tile--active {
          background: #2563eb !important;
          color: white !important;
          border-radius: 10px;
        }
        .react-calendar__tile:hover {
          background: #eef2ff !important;
          border-radius: 10px;
        }
        .react-calendar__navigation button {
          font-size: 1.3rem;
          padding: 12px;
        }
      `}</style>
    </div>
  );
}
