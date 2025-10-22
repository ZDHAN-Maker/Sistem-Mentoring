// src/components/MenteeList.jsx
import React, { useEffect, useState } from 'react';
import axiosInstance from '../axiosInstance';

const MenteeList = () => {
  const [mentees, setMentees] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Mengambil data mentees dari API Laravel
    axiosInstance.get('/mentees')
      .then(response => {
        setMentees(response.data);
        setLoading(false);
      })
      .catch(error => {
        console.error("Error fetching mentees:", error);
        setLoading(false);
      });
  }, []);

  if (loading) return <div>Loading...</div>;

  return (
    <div>
      <h1>Daftar Mentee</h1>
      <ul>
        {mentees.map((mentee) => (
          <li key={mentee.id}>{mentee.name}</li>
        ))}
      </ul>
    </div>
  );
};

export default MenteeList;
