import { Routes, Route } from "react-router-dom";
import DashboardHome from "../../pages/Role/Admin/DashboardHome";
import AdminUserManagement from "../../pages/Role/Admin/AdminUserManagement";
import LearningActivities from "../../pages/Role/Admin/LearningActivities";
import ProgressReportAdmin from "../../pages/Role/Admin/ProgressReportAdmin";
import StudentPortalAdmin from "../../pages/Role/Admin/StudentPortalAdmin";
import TutoringScheduleAdmin from "../../pages/Role/Admin/TutoringScheduleAdmin";

const AdminRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<DashboardHome />} />
      <Route path="user-management" element={<AdminUserManagement />} />
      <Route path="learning-activities" element={<LearningActivities />} />
      <Route path="progress-report" element={<ProgressReportAdmin />} />
      <Route path="student-portal" element={<StudentPortalAdmin />} />
      <Route path="tutoring-schedule" element={<TutoringScheduleAdmin />} />
    </Routes>
  );
};

export default AdminRoutes;
