import React, { useState } from "react";
import Sidebar from "../../../components/Sidebar";
import Navbar from "../../../components/Navbar";

export default function MentoringSchedule() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [showModal, setShowModal] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);
  const [eventTitle, setEventTitle] = useState("");
  const [eventTime, setEventTime] = useState("");
  const [eventStatus, setEventStatus] = useState("Belum Dimulai");

  const [events, setEvents] = useState(() => {
    const saved = localStorage.getItem("mentor-events");
    return saved ? JSON.parse(saved) : [];
  });

  React.useEffect(() => {
    localStorage.setItem("mentor-events", JSON.stringify(events));
  }, [events]);

  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  const dayNames = ["SEN", "SEL", "RAB", "KAM", "JUM", "SAB", "MIN"];

  const getDaysInMonth = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();
    
    const days = [];
    
    // Previous month days
    const prevMonthLastDay = new Date(year, month, 0).getDate();
    const prevMonthDays = startingDayOfWeek === 0 ? 6 : startingDayOfWeek - 1;
    
    for (let i = prevMonthDays; i > 0; i--) {
      days.push({
        day: prevMonthLastDay - i + 1,
        isCurrentMonth: false,
        date: new Date(year, month - 1, prevMonthLastDay - i + 1)
      });
    }
    
    // Current month days
    for (let i = 1; i <= daysInMonth; i++) {
      days.push({
        day: i,
        isCurrentMonth: true,
        date: new Date(year, month, i)
      });
    }
    
    // Next month days
    const remainingDays = 42 - days.length;
    for (let i = 1; i <= remainingDays; i++) {
      days.push({
        day: i,
        isCurrentMonth: false,
        date: new Date(year, month + 1, i)
      });
    }
    
    return days;
  };

  const handlePrevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1));
  };

  const handlePrevYear = () => {
    setCurrentDate(new Date(currentDate.getFullYear() - 1, currentDate.getMonth()));
  };

  const handleNextYear = () => {
    setCurrentDate(new Date(currentDate.getFullYear() + 1, currentDate.getMonth()));
  };

  const handleDateClick = (date) => {
    setSelectedDate(date);
    setShowModal(true);
  };

  const handleCreateEvent = () => {
    if (!eventTitle || !eventTime) return;
    
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

  const isToday = (date) => {
    const today = new Date();
    return date.toDateString() === today.toDateString();
  };

  const isWeekend = (date) => {
    const day = date.getDay();
    return day === 0 || day === 6;
  };

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

  const days = getDaysInMonth(currentDate);

  return (
    <div className="flex bg-[#f8fafc] min-h-screen">
      <div className="flex-1 flex flex-col">
        <div className="flex-1 p-8">
          <h1 className="text-3xl font-semibold mb-6">Mentoring Schedule</h1>

          {/* Calendar */}
          <div className="bg-white p-8 rounded-2xl shadow-md border mb-8">
            {/* Calendar Header */}
            <div className="flex items-center justify-between mb-8">
              <button
                onClick={handlePrevYear}
                className="p-2 hover:bg-gray-100 rounded-lg text-2xl font-bold transition"
              >
                «
              </button>
              <button
                onClick={handlePrevMonth}
                className="p-2 hover:bg-gray-100 rounded-lg text-2xl font-bold transition"
              >
                ‹
              </button>
              <h2 className="text-2xl font-bold">
                {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
              </h2>
              <button
                onClick={handleNextMonth}
                className="p-2 hover:bg-gray-100 rounded-lg text-2xl font-bold transition"
              >
                ›
              </button>
              <button
                onClick={handleNextYear}
                className="p-2 hover:bg-gray-100 rounded-lg text-2xl font-bold transition"
              >
                »
              </button>
            </div>

            {/* Day Headers */}
            <div className="grid grid-cols-7 mb-2">
              {dayNames.map((day) => (
                <div
                  key={day}
                  className="text-center font-bold text-lg py-4 border-b-2 border-gray-200"
                >
                  {day}
                </div>
              ))}
            </div>

            {/* Calendar Grid */}
            <div className="grid grid-cols-7 gap-0">
              {days.map((dayObj, index) => (
                <div
                  key={index}
                  onClick={() => dayObj.isCurrentMonth && handleDateClick(dayObj.date)}
                  className={`
                    border border-gray-200 p-6 min-h-[100px] cursor-pointer
                    transition-colors duration-200
                    ${!dayObj.isCurrentMonth ? "bg-gray-50 text-gray-400" : "bg-white hover:bg-gray-50"}
                    ${isToday(dayObj.date) ? "bg-blue-600 text-white hover:bg-blue-700" : ""}
                    ${isWeekend(dayObj.date) && dayObj.isCurrentMonth && !isToday(dayObj.date) ? "text-red-500" : ""}
                  `}
                >
                  <div className={`text-2xl font-semibold ${isToday(dayObj.date) ? "text-white" : ""}`}>
                    {dayObj.day}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Schedule */}
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
    </div>
  );
}