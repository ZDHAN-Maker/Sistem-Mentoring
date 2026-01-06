import React from "react";
import useTutoringSchedule from "../../../hooks/mentee/useTutoringSchedule";

const TutoringSchedule = () => {
  const { schedules, loading, error } = useTutoringSchedule();

  return (
    <div>
      <h1 className="text-2xl font-semibold mb-4">Tutoring Schedule</h1>

      <div className="bg-white rounded-2xl shadow">
        {loading && (
          <div className="p-6 text-sm text-gray-500">
            Memuat jadwal mentoring...
          </div>
        )}

        {error && !loading && (
          <div className="p-6 text-sm text-red-500">{error}</div>
        )}

        {!loading && !error && schedules.length === 0 && (
          <div className="p-6 text-sm text-gray-500">
            Belum ada jadwal mentoring.
          </div>
        )}

        {!loading && !error && schedules.length > 0 && (
          <div className="divide-y">
            {schedules.map((item, index) => (
              <div
                key={item.id || index}
                className="p-6 hover:bg-gray-50 transition-colors"
              >
                <h3 className="font-medium text-gray-900">
                  Mentoring dengan {item.pairing?.mentor?.name || "Mentor"}
                </h3>

                <p className="text-sm text-gray-500 mt-1">
                  Topik: {item.topic || "Mentoring Schedule"}
                </p>

                <p className="text-xs text-gray-400 mt-2">
                  Jadwal:{" "}
                  {item.scheduled_at
                    ? new Date(item.scheduled_at).toLocaleString()
                    : "-"}
                </p>

                <p className="text-xs text-gray-400">
                  Status: {item.status || "scheduled"}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default TutoringSchedule;
