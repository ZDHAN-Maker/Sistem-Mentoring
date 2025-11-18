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

  // Simpan otomatis ke localStorage setiap events berubah
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
    <div className="flex min-h-screen bg-[#f8fafc]">
      <Sidebar />
      <div className="flex-1">
        <Navbar />

        <main className="p-8">
          <h1 className="text-3xl font-semibold mb-6">Mentoring Schedule</h1>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Calendar Section */}
            <div className="lg:col-span-1 bg-white p-4 rounded-xl shadow">
              <Calendar
                onChange={(date) => {
                  setSelectedDate(date);
                  setShowModal(true);
                }}
                value={selectedDate}
              />
            </div>

            {/* Event List */}
            <div className="lg:col-span-2 bg-white p-6 rounded-xl shadow">
              <h2 className="text-xl font-semibold mb-4">Jadwal Mentor</h2>
              {events.length === 0 ? (
                <p className="text-gray-500">Belum ada acara</p>
              ) : (
                <ul className="space-y-3">
                  {events.map((ev, idx) => (
                    <li key={idx} className="p-4 border rounded-lg shadow-sm">
                      <p className="font-semibold">{ev.title}</p>
                      <p className="text-sm text-gray-600">{ev.date} - {ev.time}</p>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </main>
      </div>

      {/* Modal Create Event */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-xl shadow-xl w-96">
            <h3 className="text-xl font-semibold mb-4">Buat Acara</h3>

            <label className="block mb-3 text-sm">Judul Acara:</label>
            <input
              type="text"
              className="w-full p-2 border rounded-lg mb-4"
              value={eventTitle}
              onChange={(e) => setEventTitle(e.target.value)}
              placeholder="Contoh: Meeting, Review Progress"
            />

            <label className="block mb-3 text-sm">Waktu:</label>
            <input
              type="time"
              className="w-full p-2 border rounded-lg mb-4"
              value={eventTime}
              onChange={(e) => setEventTime(e.target.value)}
            />

            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 bg-gray-300 rounded-lg"
              >
                Batal
              </button>
              <button
                onClick={handleCreateEvent}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg"
              >
                Simpan
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
