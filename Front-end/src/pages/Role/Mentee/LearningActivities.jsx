import React from "react";
import useLearningActivities from "../../../hooks/mentee/useLearningActivities";

const LearningActivities = () => {
  const {
    activities,
    materials,
    selectedActivity,
    loadingActivities,
    loadingMaterials,
    error,
    fetchMaterials,
  } = useLearningActivities();

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold">Aktivitas Pembelajaran</h1>

      {error && <p className="text-red-500">{error}</p>}

      {/* ACTIVITIES */}
      <div className="grid gap-3">
        {loadingActivities ? (
          <p>Loading aktivitas...</p>
        ) : activities.length === 0 ? (
          <p className="text-slate-500">Belum ada aktivitas</p>
        ) : (
          activities.map((activity) => (
            <button
              key={activity.id}
              onClick={() => fetchMaterials(activity.id)}
              className={`p-3 rounded-lg text-left border transition
                ${
                  selectedActivity === activity.id
                    ? "bg-blue-50 border-blue-400"
                    : "bg-white hover:bg-slate-50"
                }`}
            >
              {activity.title}
            </button>
          ))
        )}
      </div>

      {/* MATERIALS */}
      {selectedActivity && (
        <div className="bg-white border rounded-lg p-4">
          <h2 className="font-semibold mb-3">Materi</h2>

          {loadingMaterials ? (
            <p>Loading materi...</p>
          ) : materials.length === 0 ? (
            <p className="text-slate-500">Belum ada materi</p>
          ) : (
            <ul className="space-y-2">
              {materials.map((material) => (
                <li key={material.id}>
                  <a
                    href={material.video_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline"
                  >
                    {material.title}
                  </a>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
};

export default LearningActivities;
