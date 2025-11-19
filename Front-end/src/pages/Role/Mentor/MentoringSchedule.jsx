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
    };

    setEvents([...events, newEvent]);

    setEventTitle("");
    setEventTime("");
    setShowModal(false);
  };

  return (
    <div className="flex bg-[#f8fafc] min-h-screen">
      {/* Main Content */}
      <div className="flex-1 p-8">
        <h1 className="text-3xl font-semibold mb-6">Mentoring Schedule</h1>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Kalender diperbesar */}
          <div className="bg-white p-6 rounded-2xl shadow-md border">
            <Calendar
              onChange={(date) => {
                setSelectedDate(date);
                setShowModal(true);
              }}
              value={selectedDate}
              className="w-full text-lg custom-calendar"
            />
          </div>

          {/* Event List */}
          <div className="bg-white p-6 rounded-2xl shadow-md border">
            <h2 className="text-xl font-semibold mb-4">Jadwal Mentor</h2>

            {events.length === 0 ? (
              <p className="text-gray-500">Belum ada acara</p>
            ) : (
              <ul className="space-y-4">
                {events.map((ev, idx) => (
                  <li
                    key={idx}
                    className="p-4 border rounded-xl shadow-sm bg-gray-50 hover:bg-gray-100 transition"
                  >
                    <p className="font-semibold text-lg">{ev.title}</p>
                    <p className="text-sm text-gray-600">
                      {ev.date} — {ev.time}
                    </p>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>

      {/* Modal — Background Blur */}
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

      {/* Extra CSS for calendar */}
      <style>{`
        .custom-calendar {
          font-size: 1.1rem;
        }
        .react-calendar {
          padding: 20px;
          border-radius: 15px;
          border: 1px solid #e5e7eb;
        }
        .react-calendar__tile {
          padding: 18px !important;
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
          font-size: 1.2rem;
          padding: 10px;
        }
      `}</style>
    </div>
  );
}
