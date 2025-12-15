import React, { useState } from "react";
import Sidebar from "../../../components/Sidebar";
import Navbar from "../../../components/Navbar";
import Button from "../../../components/Button"; // ⬅ IMPORT BUTTON KAMU

export default function MentoringSchedule() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [showModal, setShowModal] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);
  const [eventTitle, setEventTitle] = useState("");
  const [eventTime, setEventTime] = useState("");
  const [eventStatus, setEventStatus] = useState("Belum Dimulai");

  const [selectedEvent, setSelectedEvent] = useState(null);

  const [events, setEvents] = useState(() => {
    const saved = localStorage.getItem("mentor-events");
    return saved ? JSON.parse(saved) : [];
  });

  React.useEffect(() => {
    localStorage.setItem("mentor-events", JSON.stringify(events));
  }, [events]);

  const monthNames = [
    "January","February","March","April","May","June",
    "July","August","September","October","November","December",
  ];

  const dayNames = ["SEN","SEL","RAB","KAM","JUM","SAB","MIN"];

  const getDaysInMonth = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    const days = [];

    const prevMonthLastDay = new Date(year, month, 0).getDate();
    const prevMonthDays = startingDayOfWeek === 0 ? 6 : startingDayOfWeek - 1;

    for (let i = prevMonthDays; i > 0; i--) {
      days.push({
        day: prevMonthLastDay - i + 1,
        isCurrentMonth: false,
        date: new Date(year, month - 1, prevMonthLastDay - i + 1),
      });
    }

    for (let i = 1; i <= daysInMonth; i++) {
      days.push({
        day: i,
        isCurrentMonth: true,
        date: new Date(year, month, i),
      });
    }

    const remainingDays = 42 - days.length;
    for (let i = 1; i <= remainingDays; i++) {
      days.push({
        day: i,
        isCurrentMonth: false,
        date: new Date(year, month + 1, i),
      });
    }

    return days;
  };

  const handleDateClick = (date) => {
    setSelectedEvent(null);
    setSelectedDate(date);
    setEventTitle("");
    setEventTime("");
    setEventStatus("Belum Dimulai");
    setShowModal(true);
  };

  const handleEditEvent = (ev, index) => {
    setSelectedEvent({ ...ev, index });
    setEventTitle(ev.title);
    setEventTime(ev.time);
    setEventStatus(ev.status);
    setSelectedDate(new Date(ev.date));
    setShowModal(true);
  };

  const handleDeleteEvent = (index) => {
    const updated = events.filter((_, i) => i !== index);
    setEvents(updated);
  };

  const handleSaveEvent = () => {
    if (!eventTitle || !eventTime) return;

    const eventData = {
      date: selectedDate.toDateString(),
      title: eventTitle,
      time: eventTime,
      status: eventStatus,
    };

    if (selectedEvent) {
      const updated = [...events];
      updated[selectedEvent.index] = eventData;
      setEvents(updated);
    } else {
      setEvents([...events, eventData]);
    }

    setShowModal(false);
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
        <div className="p-8">
          <h1 className="text-3xl font-semibold mb-6">Mentoring Schedule</h1>

          {/* Calendar */}
          <div className="bg-white p-8 rounded-2xl shadow-md border mb-8">
            {/* Header */}
            <div className="flex items-center justify-between mb-8">

              {/* PREV YEAR */}
              <Button onClick={() =>
                setCurrentDate(
                  new Date(currentDate.getFullYear() - 1, currentDate.getMonth())
                )
              }>
                «
              </Button>

              {/* PREV MONTH */}
              <Button onClick={() =>
                setCurrentDate(
                  new Date(currentDate.getFullYear(), currentDate.getMonth() - 1)
                )
              }>
                ‹
              </Button>

              <h2 className="text-2xl font-bold">
                {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
              </h2>

              {/* NEXT MONTH */}
              <Button onClick={() =>
                setCurrentDate(
                  new Date(currentDate.getFullYear(), currentDate.getMonth() + 1)
                )
              }>
                ›
              </Button>

              {/* NEXT YEAR */}
              <Button onClick={() =>
                setCurrentDate(
                  new Date(currentDate.getFullYear() + 1, currentDate.getMonth())
                )
              }>
                »
              </Button>
            </div>

            {/* Day headers */}
            <div className="grid grid-cols-7 mb-2">
              {dayNames.map((day) => (
                <div key={day} className="text-center font-bold py-4 border-b-2">
                  {day}
                </div>
              ))}
            </div>

            {/* Grid */}
            <div className="grid grid-cols-7">
              {days.map((d, idx) => (
                <div
                  key={idx}
                  onClick={() => d.isCurrentMonth && handleDateClick(d.date)}
                  className={`border p-6 cursor-pointer 
                    ${!d.isCurrentMonth ? "bg-gray-50 text-gray-400" : ""}
                  `}
                >
                  <div className="text-2xl font-semibold">{d.day}</div>
                </div>
              ))}
            </div>
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
                    className={`p-4 border rounded-xl shadow-sm ${statusColor(ev.status)}`}
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="font-bold text-lg">{ev.title}</p>
                        <p className="text-sm">{ev.date} — {ev.time}</p>
                        <p className="text-sm">Status: {ev.status}</p>
                      </div>

                      <div className="flex gap-2">
                        <Button onClick={() => handleEditEvent(ev, idx)} className="!px-4 !py-1">
                          Edit
                        </Button>

                        <Button
                          onClick={() => handleDeleteEvent(idx)}
                          className="!px-4 !py-1 bg-red-600 hover:bg-red-700 text-white"
                        >
                          Hapus
                        </Button>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>

      {/* MODAL */}
      {showModal && (
        <div className="fixed inset-0 bg-black/20 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-2xl shadow-2xl w-96 border">
            <h3 className="text-xl font-semibold mb-4">
              {selectedEvent ? "Edit Acara" : "Buat Acara"}
            </h3>

            <label className="block text-sm mb-1">Judul Acara</label>
            <input
              type="text"
              className="w-full p-3 border rounded-lg mb-4"
              value={eventTitle}
              onChange={(e) => setEventTitle(e.target.value)}
            />

            <label className="block text-sm mb-1">Waktu</label>
            <input
              type="time"
              className="w-full p-3 border rounded-lg mb-4"
              value={eventTime}
              onChange={(e) => setEventTime(e.target.value)}
            />

            <label className="block text-sm mb-1">Status</label>
            <select
              className="w-full p-3 border rounded-lg mb-4"
              value={eventStatus}
              onChange={(e) => setEventStatus(e.target.value)}
            >
              <option value="Belum Dimulai">Belum Dimulai</option>
              <option value="Selesai">Selesai</option>
              <option value="Tidak Selesai">Tidak Selesai</option>
            </select>

            <div className="flex justify-end gap-3">
              <Button onClick={() => setShowModal(false)} className="!bg-gray-300 hover:!bg-gray-400">
                Batal
              </Button>

              <Button onClick={handleSaveEvent}>
                Simpan
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
