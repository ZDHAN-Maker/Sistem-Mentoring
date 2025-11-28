import React, { useEffect, useState } from 'react';
import api from '../../../axiosInstance';

const LearningActivities = () => {
  const [activities, setActivities] = useState([]);
  const [selectedActivity, setSelectedActivity] = useState(null);
  const [materials, setMaterials] = useState([]);

  // Mengambil daftar aktivitas pembelajaran saat komponen dimuat
  useEffect(() => {
    const fetchActivities = async () => {
      try {
        const res = await api.get('/learning-activities/activities');
        setActivities(res.data.data);
      } catch (error) {
        console.error('Error fetching activities:', error);
      }
    };

    fetchActivities();
  }, []);

  // Menangani pemilihan aktivitas dan mengambil materi terkait
  const handleSelectActivity = async (id) => {
    try {
      const res = await api.get(`/learning-activities/activities/${id}/materials`);
      setMaterials(res.data.data);
      setSelectedActivity(id);
    } catch (error) {
      console.error('Error fetching materials:', error);
    }
  };

  return (
    <div>
      <h1>Aktivitas Pembelajaran</h1>
      <div>
        {/* Daftar Aktivitas Pembelajaran */}
        <ul>
          {activities.map((activity) => (
            <li
              key={activity.id}
              onClick={() => handleSelectActivity(activity.id)}
              style={{ cursor: 'pointer', margin: '10px 0', padding: '10px', backgroundColor: '#f2f2f2' }}
            >
              {activity.title}
            </li>
          ))}
        </ul>
      </div>

      {/* Menampilkan materi berdasarkan aktivitas yang dipilih */}
      {selectedActivity && (
        <div>
          <h2>Materi untuk Aktivitas yang Dipilih</h2>
          <ul>
            {materials.length === 0 ? (
              <p>Belum ada materi untuk aktivitas ini</p>
            ) : (
              materials.map((material) => (
                <li key={material.id}>
                  <a href={`/storage/${material.file_path}`} target="_blank" rel="noopener noreferrer">
                    {material.title}
                  </a>
                </li>
              ))
            )}
          </ul>
        </div>
      )}
    </div>
  );
};

export default LearningActivities;
