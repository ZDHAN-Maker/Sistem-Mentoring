import React, { useState } from "react";
import Button from "../../../components/Button";
import useSchedule from "../../../hooks/Mentor/useSchedule";

import {
  ChevronLeftIcon,
  ChevronRightIcon,
  CalendarDaysIcon,
  ClockIcon,
  UserIcon,
  PencilSquareIcon,
  TrashIcon,
} from "@heroicons/react/24/outline";

export default function MentoringSchedule() {
  const {
    pairings,
    events,
    loading,
    createSchedule,
    updateSchedule,
    deleteSchedule,
  } = useSchedule();

  const [currentDate, setCurrentDate] = useState(new Date());
  const [showModal, setShowModal] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);
  const [eventTime, setEventTime] = useState("");
  const [selectedPairing, setSelectedPairing] = useState("");
  const [editingEvent, setEditingEvent] = useState(null);

  const monthNames = [
    "January","February","March","April","May","June",
    "July","August","September","October","November","December",
  ];
  const dayNames = ["SEN", "SEL", "RAB", "KAM", "JUM", "SAB", "MIN"];

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
      days.push({
        day: i,
        isCurrentMonth: true,
        date: new Date(year, month, i),
      });
    }

    while (days.length < 42) {
      const d = days.length - lastDay.getDate() + 1;
      days.push({
        day: d,
        isCurrentMonth: false,
        date: new Date(year, month + 1, d),
      });
    }

    return days;
  };

  /* HANDLERS =============================== */

  const handleDateClick = (date) => {
    setSelectedDate(date);
    setEventTime("");
    setSelectedPairing("");
    setEditingEvent(null);
    setShowModal(true);
  };

  const handleEdit = (event) => {
    const date = new Date(event.startTime);
    setEditingEvent(event);
    setSelectedDate(date);
    setEventTime(date.toISOString().slice(11, 16));
    setSelectedPairing(event.pairingId);
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Yakin ingin menghapus jadwal ini?")) return;
    await deleteSchedule(id);
  };

  const handleSave = async () => {
    if (!selectedDate || !eventTime || !selectedPairing) return;

    const year = selectedDate.getFullYear();
    const month = String(selectedDate.getMonth() + 1).padStart(2, "0");
    const day = String(selectedDate.getDate()).padStart(2, "0");
    const start_time = `${year}-${month}-${day} ${eventTime}:00`;

    if (editingEvent) {
      await updateSchedule(editingEvent.id, { start_time });
    } else {
      await createSchedule({
        pairing_id: selectedPairing,
        date: `${year}-${month}-${day}`,
        time: eventTime,
      });
    }

    setShowModal(false);
    setEditingEvent(null);
  };

  const days = getDaysInMonth(currentDate);

  return (
    <div className="p-8 bg-[#f7f9fc] min-h-screen">
      {/* ================== CALENDAR ================== */}
      <div className="bg-white p-8 rounded-3xl shadow-md border mb-8">
        <div className="flex items-center justify-between mb-8">
          <button
            onClick={() =>
              setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1))
            }
            className="p-2 bg-gray-100 rounded-full hover:bg-gray-200 transition"
          >
            <ChevronLeftIcon className="w-6 h-6" />
          </button>

          <h2 className="text-3xl font-bold flex items-center gap-2">
            <CalendarDaysIcon className="w-7 h-7 text-blue-500" />
            {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
          </h2>

          <button
            onClick={() =>
              setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1))
            }
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
                d.isCurrentMonth
                  ? "bg-white hover:bg-blue-50"
                  : "bg-gray-50 text-gray-400"
              }`}
            >
              <div className="text-lg font-semibold">{d.day}</div>
            </div>
          ))}
        </div>
      </div>

      {/* ================== EVENT LIST ================== */}
      <div className="bg-white p-6 rounded-2xl shadow-md border">
        <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
          <ClockIcon className="w-6 h-6 text-indigo-500" />
          Jadwal Mentor
        </h2>

        {loading ? (
          <p>Loading...</p>
        ) : events.length === 0 ? (
          <p className="text-gray-500">Belum ada jadwal</p>
        ) : (
          <ul className="space-y-4">
            {events.map((ev) => (
              <li
                key={ev.id}
                className="p-5 border rounded-2xl bg-gray-50 shadow-sm hover:shadow-md transition"
              >
                <p className="font-bold flex items-center gap-2">
                  <UserIcon className="w-5 h-5 text-green-600" />
                  Mentoring dengan {ev.menteeName}
                </p>

                <p className="text-sm mt-1 mb-3 text-gray-600">
                  {new Date(ev.startTime).toLocaleString("id-ID", {
                    timeZone: "Asia/Jakarta",
                  })}
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

      {/* ================= MODAL ================= */}
      {showModal && (
        <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-2xl w-96 shadow-xl">
            <h3 className="text-xl font-semibold mb-4">
              {editingEvent ? "Edit Jadwal" : "Buat Jadwal"}
            </h3>

            <label className="text-sm font-medium">Mentee</label>
            <select
              className="w-full p-3 border rounded-lg mb-4"
              value={selectedPairing}
              onChange={(e) => setSelectedPairing(e.target.value)}
            >
              <option value="">Pilih Mentee</option>
              {pairings.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.mentee.name}
                </option>
              ))}
            </select>

            <label className="text-sm font-medium">Waktu</label>
            <input
              type="time"
              className="w-full p-3 border rounded-lg mb-6"
              value={eventTime}
              onChange={(e) => setEventTime(e.target.value)}
            />

            <div className="flex justify-end gap-3">
              <button
                onClick={() => {
                  setShowModal(false);
                  setEditingEvent(null);
                }}
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
