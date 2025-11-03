import React, { useState } from 'react';
// Perbaiki path ke UploadForm sesuai lokasi sebenarnya
import UploadForm from '../../../components/UploadForm';  

const LearningActivities = () => {
  const [courses] = useState([
    { id: 1, title: 'Memulai Dasar Pemrograman untuk Menjadi Pengembang Software' },
    { id: 2, title: 'Memulai Dasar Pemrograman untuk Menjadi Pengembang Software' },
    { id: 3, title: 'Memulai Dasar Pemrograman untuk Menjadi Pengembang Software' },
    { id: 4, title: 'Memulai Dasar Pemrograman untuk Menjadi Pengembang Software' },
    { id: 5, title: 'Memulai Dasar Pemrograman untuk Menjadi Pengembang Software' },
    { id: 6, title: 'Memulai Dasar Pemrograman untuk Menjadi Pengembang Software' },
    { id: 7, title: 'Memulai Dasar Pemrograman untuk Menjadi Pengembang Software' },
  ]);

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-6">Learning Activities</h1>
      <div className="space-y-4">
        {courses.map((course) => (
          <div
            className="flex justify-between items-center p-4 bg-gray-100 rounded-md shadow-md"
            key={course.id}
          >
            <p className="text-xl text-gray-700">{course.title}</p>
            <button className="bg-brown-600 text-white px-4 py-2 rounded-lg hover:bg-brown-700">
              Mulai Kelas
            </button>
          </div>
        ))}
      </div>

      <div className="mt-8">
        <UploadForm /> {/* Upload form for mentors */}
      </div>
    </div>
  );
};

export default LearningActivities;
