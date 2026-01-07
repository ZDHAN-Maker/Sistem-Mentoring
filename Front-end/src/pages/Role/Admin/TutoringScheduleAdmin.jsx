// src/pages/Role/Admin/TutoringScheduleAdmin.jsx

import React, { useState, useMemo } from "react";
import Button from "../../../components/Button";
import useSchedule from "../../../hooks/useSchedule";

import {
  ChevronLeftIcon,
  ChevronRightIcon,
  CalendarDaysIcon,
  ClockIcon,
  UserIcon,
  PencilSquareIcon,
  TrashIcon,
} from "@heroicons/react/24/outline";

export default function TutoringScheduleAdmin() {
  const {
    schedules,
    createNewSchedule,
    editSchedule,
    removeSchedule,
    loading,
  } = useSchedule();

  const [currentDate, setCurrentDate] = useState(new Date());
  const [showModal, setShowModal] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);
  const [eventTime, setEventTime] = useState("");
  const [selectedSchedule, setSelectedSchedule] = useState(null);
  const [title, setTitle] = useState("");

  const monthNames = [
    "Januari","Februari","Maret","April","Mei","Juni",
    "Juli","Agustus","September","Oktober","November","Desember",
  ];
  const dayNames = ["SEN","SEL","RAB","KAM","JUM","SAB","MIN"];

  // ===== Kalender generator mirip contoh baru =====
  const getDaysInMonth = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);

    const days = [];
    const prevMonthDays = firstDay.getDay() === 0 ? 6 : firstDay.getDay() - 1;
    const prevMonthLastDay = new Date(year, month, 0).getDate();

    for (let i = prevMonthDays; i > 0; i--) {
      days.push({
        day: prevMonthLastDay - i + 1,
        isCurrentMonth: false,
        date: new Date(year, month - 1, prevMonthLastDay - i + 1),
      });
    }

    for (let i = 1; i <= lastDay.getDate(); i++) {
      days.push({ day: i, isCurrentMonth: true, date: new Date(year, month, i) });
    }

    while (days.length < 42) {
      const d = days.length - lastDay.getDate() + 1;
      days.push({ day: d, isCurrentMonth: false, date: new Date(year, month + 1, d) });
    }

    return days;
  };

  const days = useMemo(() => getDaysInMonth(currentDate), [currentDate]);

  // ===== Event handlers =====
  const handleDateClick = (date) => {
    setSelectedDate(date);
    setEventTime("");
    setTitle("");
    setSelectedSchedule(null);
    setShowModal(true);
  };

  const handleEdit = (schedule) => {
    const date = new Date(schedule.start_time);
    setSelectedSchedule(schedule);
    setSelectedDate(date);
    setEventTime(date.toISOString().slice(11, 16));
    setTitle(schedule.title);
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Yakin ingin menghapus jadwal ini?")) return;
    await removeSchedule(id);
  };

  const handleSave = async () => {
    if (!selectedDate || !eventTime || !title) return;

    const y = selectedDate.getFullYear();
    const m = String(selectedDate.getMonth() + 1).padStart(2, "0");
    const d = String(selectedDate.getDate()).padStart(2, "0");
    const start_time = `${y}-${m}-${d} ${eventTime}:00`;
    const end_time = `${y}-${m}-${d} ${eventTime}:00`;

    const payload = { title, start_time, end_time, status: "Belum Dimulai", pairing_id: 1 };

    if (selectedSchedule) {
      await editSchedule(selectedSchedule.id, payload);
    } else {
      await createNewSchedule(payload);
    }

    setShowModal(false);
    setSelectedSchedule(null);
  };

  const eventsThisMonth = schedules.filter(
    (s) =>
      new Date(s.start_time).getMonth() === currentDate.getMonth() &&
      new Date(s.start_time).getFullYear() === currentDate.getFullYear()
  );

  return (
    <div className="p-8 bg-[#f7f9fc] min-h-screen">
      {/* ===== Kalender ===== */}
      <div className="bg-white p-8 rounded-3xl shadow-md border mb-8">
        <div className="flex items-center justify-between mb-8">
          <button
            onClick={() => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1))}
            className="p-2 bg-gray-100 rounded-full hover:bg-gray-200 transition"
          >
            <ChevronLeftIcon className="w-6 h-6" />
          </button>

          <h2 className="text-3xl font-bold flex items-center gap-2">
            <CalendarDaysIcon className="w-7 h-7 text-blue-500" />
            {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
          </h2>

          <button
            onClick={() => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1))}
            className="p-2 bg-gray-100 rounded-full hover:bg-gray-200 transition"
          >
            <ChevronRightIcon className="w-6 h-6" />
          </button>
        </div>

        <div className="grid grid-cols-7 mb-2">
          {dayNames.map((day) => (
            <div key={day} className="text-center font-bold py-3 border-b">
              {day}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-7 gap-1">
          {days.map((d, i) => (
            <div
              key={i}
              onClick={() => d.isCurrentMonth && handleDateClick(d.date)}
              className={`border p-5 rounded-xl cursor-pointer transition ${
                d.isCurrentMonth ? "bg-white hover:bg-blue-50" : "bg-gray-50 text-gray-400"
              }`}
            >
              <div className="text-lg font-semibold">{d.day}</div>
            </div>
          ))}
        </div>
      </div>

      {/* ===== Daftar Jadwal ===== */}
      <div className="bg-white p-6 rounded-2xl shadow-md border">
        <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
          <ClockIcon className="w-6 h-6 text-indigo-500" />
          Jadwal Mentor
        </h2>

        {loading ? (
          <p>Loading...</p>
        ) : eventsThisMonth.length === 0 ? (
          <p className="text-gray-500">Belum ada jadwal</p>
        ) : (
          <ul className="space-y-4">
            {eventsThisMonth.map((ev) => (
              <li
                key={ev.id}
                className="p-5 border rounded-2xl bg-gray-50 shadow-sm hover:shadow-md transition"
              >
                <p className="font-bold flex items-center gap-2">
                  <UserIcon className="w-5 h-5 text-green-600" />
                  {ev.title}
                </p>

                <p className="text-sm mt-1 mb-3 text-gray-600">
                  {new Date(ev.start_time).toLocaleString("id-ID", { timeZone: "Asia/Jakarta" })}
                </p>

                <div className="flex gap-3">
                  <button
                    onClick={() => handleEdit(ev)}
                    className="flex items-center gap-2 px-3 py-2 rounded-xl bg-blue-100 text-blue-700 hover:bg-blue-200"
                  >
                    <PencilSquareIcon className="w-5 h-5" />
                    Edit
                  </button>

                  <button
                    onClick={() => handleDelete(ev.id)}
                    className="flex items-center gap-2 px-3 py-2 rounded-xl bg-red-100 text-red-700 hover:bg-red-200"
                  >
                    <TrashIcon className="w-5 h-5" />
                    Hapus
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* ===== Modal ===== */}
      {showModal && (
        <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-2xl w-96 shadow-xl">
            <h3 className="text-xl font-semibold mb-4">
              {selectedSchedule ? "Edit Jadwal" : "Buat Jadwal"}
            </h3>

            <label className="text-sm font-medium">Judul</label>
            <input
              className="w-full p-3 border rounded-lg mb-4"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />

            <label className="text-sm font-medium">Waktu</label>
            <input
              type="time"
              className="w-full p-3 border rounded-lg mb-6"
              value={eventTime}
              onChange={(e) => setEventTime(e.target.value)}
            />

            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300"
              >
                Batal
              </button>

              <button
                onClick={handleSave}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
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
