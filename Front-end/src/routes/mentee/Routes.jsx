// src/routes/mentee.routes.jsx
import React from "react";
import { Routes, Route } from "react-router-dom";

// Import semua halaman mentee
import DashboardHome from "../../pages/Role/Mentee/DashboardHome";
import MyTasks from "../../pages/Role/Mentee/MyTasks";
import MyReports from "../../pages/Role/Mentee/MyReports";
import TutoringSchedule from "../../pages/Role/Mentee/TutoringSchedule";
import MyMentor from "../../pages/Role/Mentee/MyMentor";
import AnnouncementsMentee from "../../pages/Role/Mentee/AnnouncementsMentee";
import StudentPortal from "../../pages/Role/Mentee/StudentPortalMentee";
import LearningActivities from "../../pages/Role/Mentee/LearningActivities";

const MenteeRoutes = () => {
  return (
    <Routes>
      <Route index element={<DashboardHome />} />
      <Route path="tasks" element={<MyTasks />} />
      <Route path="reports" element={<MyReports />} />
      <Route path="schedule" element={<TutoringSchedule />} />
      <Route path="mentor" element={<MyMentor />} />
      <Route path="announcements" element={<AnnouncementsMentee />} />
      <Route path="student-portal" element={<StudentPortal />} />
      <Route path="learning-activities" element={<LearningActivities />} />
    </Routes>
  );
};

export default MenteeRoutes;
