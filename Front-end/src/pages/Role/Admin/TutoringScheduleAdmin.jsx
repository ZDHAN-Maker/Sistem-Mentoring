// src/pages/Role/Admin/TutoringScheduleAdmin.jsx

import React, { useState, useMemo } from "react";
import useSchedule from "../../../hooks/useSchedule";
import Button from "../../../components/Button";

export default function TutoringScheduleAdmin() {
  const { schedules, createNewSchedule, editSchedule, removeSchedule } =
    useSchedule();

  const [currentDate, setCurrentDate] = useState(new Date());
  const [showModal, setShowModal] = useState(false);

  const [selectedSchedule, setSelectedSchedule] = useState(null);
  const [selectedDate, setSelectedDate] = useState(null);

  const [title, setTitle] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [status, setStatus] = useState("Belum Dimulai");

  const monthNames = [
    "Januari","Februari","Maret","April","Mei","Juni",
    "Juli","Agustus","September","Oktober","November","Desember",
  ];

  const dayNames = ["Min", "Sen", "Sel", "Rab", "Kam", "Jum", "Sab"];

  // ---- Calendar generator ----
  const calendarDays = useMemo(() => {
    const firstDay = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth(),
      1
    );
    const lastDay = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth() + 1,
      0
    );

    const days = [];
    const startOffset = firstDay.getDay();
    const totalDays = lastDay.getDate();

    // Fill blanks
    for (let i = 0; i < startOffset; i++) {
      days.push({ day: "", date: null, isCurrentMonth: false });
    }

    // Actual days
    for (let i = 1; i <= totalDays; i++) {
      days.push({
        day: i,
        date: new Date(currentDate.getFullYear(), currentDate.getMonth(), i),
        isCurrentMonth: true,
      });
    }

    return days;
  }, [currentDate]);

  // ---- Open modal create ----
  const openModalForCreate = (dateObj) => {
    if (!dateObj) return;

    setSelectedSchedule(null);
    setSelectedDate(dateObj.toISOString().split("T")[0]); // yyyy-mm-dd
    setTitle("");
    setStartTime("");
    setEndTime("");
    setStatus("Belum Dimulai");

    setShowModal(true);
  };

  // ---- Open modal edit ----
  const openModalForEdit = (schedule) => {
    const baseDate = schedule.start_time.split(" ")[0];

    setSelectedSchedule(schedule);
    setSelectedDate(baseDate);
    setTitle(schedule.title);
    setStartTime(schedule.start_time.split(" ")[1]?.slice(0, 5) || "");
    setEndTime(schedule.end_time.split(" ")[1]?.slice(0, 5) || "");
    setStatus(schedule.status || "Belum Dimulai");

    setShowModal(true);
  };

  // ---- Save schedule ----
  const saveSchedule = async () => {
    if (!selectedDate) return;

    const payload = {
      title,
      description: "-",
      start_time: `${selectedDate} ${startTime}`,
      end_time: `${selectedDate} ${endTime}`,
      status,
      pairing_id: 1, // default pairing (nanti dihubungkan)
    };

    if (selectedSchedule) {
      await editSchedule(selectedSchedule.id, payload);
    } else {
      await createNewSchedule(payload);
    }

    setShowModal(false);
  };

  // ---- Filter events this month ----
  const eventsThisMonth = schedules.filter((s) => {
    return (
      new Date(s.start_time).getMonth() === currentDate.getMonth() &&
      new Date(s.start_time).getFullYear() === currentDate.getFullYear()
    );
  });

  const statusColor = (st) => {
    if (st === "Selesai") return "bg-green-100 border-green-300";
    if (st === "Tidak Selesai") return "bg-red-100 border-red-300";
    return "bg-yellow-100 border-yellow-300";
  };

  // ---- UI ----
  return (
    <div className="flex bg-[#f8fafc] min-h-screen">
      <div className="flex-1 flex flex-col">
        <div className="p-8">
          <h1 className="text-3xl font-semibold mb-6">Mentoring Schedule</h1>

          {/* Calendar */}
          <div className="bg-white p-8 rounded-2xl shadow-md border mb-8">
            <div className="flex items-center justify-between mb-8">
              <Button onClick={() => setCurrentDate(new Date(currentDate.setFullYear(currentDate.getFullYear() - 1)))}>
                «
              </Button>
              <Button onClick={() => setCurrentDate(new Date(currentDate.setMonth(currentDate.getMonth() - 1)))}>
                ‹
              </Button>

              <h2 className="text-2xl font-bold">
                {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
              </h2>

              <Button onClick={() => setCurrentDate(new Date(currentDate.setMonth(currentDate.getMonth() + 1)))}>
                ›
              </Button>
              <Button onClick={() => setCurrentDate(new Date(currentDate.setFullYear(currentDate.getFullYear() + 1)))}>
                »
              </Button>
            </div>

            {/* Headers */}
            <div className="grid grid-cols-7 mb-2">
              {dayNames.map((d) => (
                <div key={d} className="text-center font-semibold py-4 border-b">
                  {d}
                </div>
              ))}
            </div>

            {/* Calendar grid */}
            <div className="grid grid-cols-7">
              {calendarDays.map((d, idx) => (
                <div
                  key={idx}
                  onClick={() => d.isCurrentMonth && openModalForCreate(d.date)}
                  className={`border p-6 min-h-[100px] cursor-pointer hover:bg-gray-100 
                    ${!d.isCurrentMonth ? "bg-gray-50 text-gray-400" : ""}
                  `}
                >
                  <div className="text-xl font-semibold">{d.day}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Event List */}
          <div className="bg-white p-6 rounded-2xl shadow-md border">
            <h2 className="text-xl font-semibold mb-4">Semua Jadwal Mentor/Mentee</h2>

            {eventsThisMonth.length === 0 ? (
              <p className="text-gray-500">Belum ada acara</p>
            ) : (
              <ul className="space-y-4">
                {eventsThisMonth.map((ev) => (
                  <li
                    key={ev.id}
                    className={`p-4 border rounded-xl shadow-sm ${statusColor(ev.status)}`}
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="font-bold text-lg">{ev.title}</p>
                        <p className="text-sm">
                          {ev.start_time} → {ev.end_time}
                        </p>
                        <p className="text-sm">Status: {ev.status}</p>
                      </div>

                      <div className="flex gap-2">
                        <Button onClick={() => openModalForEdit(ev)} className="!px-4 !py-1">
                          Edit
                        </Button>

                        <Button
                          onClick={() => removeSchedule(ev.id)}
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

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/20 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-2xl shadow-2xl w-96 border">
            <h3 className="text-xl font-semibold mb-4">
              {selectedSchedule ? "Edit Jadwal" : "Buat Jadwal"}
            </h3>

            <label className="text-sm">Judul</label>
            <input
              className="w-full p-3 border rounded-lg mb-4"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />

            <label className="text-sm">Waktu Mulai</label>
            <input
              type="time"
              className="w-full p-3 border rounded-lg mb-4"
              value={startTime}
              onChange={(e) => setStartTime(e.target.value)}
            />

            <label className="text-sm">Waktu Selesai</label>
            <input
              type="time"
              className="w-full p-3 border rounded-lg mb-4"
              value={endTime}
              onChange={(e) => setEndTime(e.target.value)}
            />

            <label className="text-sm">Status</label>
            <select
              className="w-full p-3 border rounded-lg mb-4"
              value={status}
              onChange={(e) => setStatus(e.target.value)}
            >
              <option>Belum Dimulai</option>
              <option>Selesai</option>
              <option>Tidak Selesai</option>
            </select>

            <div className="flex justify-end gap-3">
              <Button
                onClick={() => setShowModal(false)}
                className="!bg-gray-200 hover:!bg-gray-300"
              >
                Batal
              </Button>

              <Button onClick={saveSchedule}>Simpan</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
