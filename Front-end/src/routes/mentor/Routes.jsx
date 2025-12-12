// src/routes/mentor/Routes.jsx
import React from "react";
import { Routes, Route } from "react-router-dom";

import DashboardHome from "../../pages/Role/Mentor/DashboardHome";
import ListOfMentees from "../../pages/Role/Mentor/ListOfMentees";
import GiveTask from "../../pages/Role/Mentor/GiveTask";
import MentoringSchedule from "../../pages/Role/Mentor/MentoringSchedule";
import ReviewReportsAndFeedback from "../../pages/Role/Mentor/ReviewReportsAndFeedback";
import UploadMaterials from "../../pages/Role/Mentor/UploadMaterials";
import AnnouncementsMentor from "../../pages/Role/Mentor/AnnouncementsMentor";

const MentorRoutes = ({
  upcomingSchedule = [],
  mentees = []
}) => {

  return (
    <Routes>
      {/* Dashboard utama */}
      <Route
        index
        element={
          <DashboardHome
            upcomingSchedule={upcomingSchedule}
            mentees={mentees}
          />
        }
      />

      {/* Halaman lainnya */}
      <Route path="mentees" element={<ListOfMentees />} />
      <Route path="tasks" element={<GiveTask />} />
      <Route path="schedules" element={<MentoringSchedule />} />
      <Route path="reports" element={<ReviewReportsAndFeedback />} />
      <Route path="materials" element={<UploadMaterials />} />
      <Route path="announcements" element={<AnnouncementsMentor />} />
    </Routes>
  );
};

export default MentorRoutes;
