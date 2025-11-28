// Contoh Komponen untuk Menampilkan Kelas dan Mengambil Materi
import React, { useEffect, useState } from 'react';
import api from '../../../axiosInstance';

const LearningActivities = () => {
  const [activities, setActivities] = useState([]);
  const [selectedActivity, setSelectedActivity] = useState(null);
  const [materials, setMaterials] = useState([]);

  useEffect(() => {
    // Ambil daftar learning activities
    const fetchActivities = async () => {
      try {
        const res = await api.get('/learning-activities');
        setActivities(res.data.data);
      } catch (error) {
        console.error('Error fetching activities:', error);
      }
    };

    fetchActivities();
  }, []);

  const handleSelectActivity = async (id) => {
    try {
      const res = await api.get(`/learning-activities/${id}/materials`);
      setMaterials(res.data.data);
      setSelectedActivity(id);
    } catch (error) {
      console.error('Error fetching materials:', error);
    }
  };

  return (
    <div>
      <h1>Choose Learning Activity</h1>
      <ul>
        {activities.map((activity) => (
          <li key={activity.id} onClick={() => handleSelectActivity(activity.id)}>
            {activity.title}
          </li>
        ))}
      </ul>

      {selectedActivity && (
        <div>
          <h2>Materials for Selected Activity</h2>
          <ul>
            {materials.map((material) => (
              <li key={material.id}>{material.title}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default LearningActivities;
