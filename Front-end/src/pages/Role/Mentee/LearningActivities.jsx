// src/pages/Role/Mentee/LearningActivities.jsx
import React from "react";
import useLearningActivities from "../../../hooks/useLearningActivities";

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
    <div>
      <h1>Aktivitas Pembelajaran</h1>

      {error && <p style={{ color: "red" }}>{error}</p>}

      {/* LIST ACTIVITIES */}
      {loadingActivities ? (
        <p>Loading aktivitas...</p>
      ) : (
        <ul>
          {activities.map((activity) => (
            <li
              key={activity.id}
              onClick={() => fetchMaterials(activity.id)}
              style={{
                cursor: "pointer",
                margin: "10px 0",
                padding: "10px",
                backgroundColor:
                  selectedActivity === activity.id ? "#dbeafe" : "#f2f2f2",
              }}
            >
              {activity.title}
            </li>
          ))}

          {activities.length === 0 && (
            <p>Belum ada aktivitas pembelajaran</p>
          )}
        </ul>
      )}

      {/* MATERIALS */}
      {selectedActivity && (
        <div>
          <h2>Materi Aktivitas</h2>

          {loadingMaterials ? (
            <p>Loading materi...</p>
          ) : materials.length === 0 ? (
            <p>Belum ada materi untuk aktivitas ini</p>
          ) : (
            <ul>
              {materials.map((material) => (
                <li key={material.id}>
                  <a
                    href={`/storage/${material.file_path}`}
                    target="_blank"
                    rel="noopener noreferrer"
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
