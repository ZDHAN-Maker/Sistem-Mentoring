import { Routes, Route } from "react-router-dom";
import DashboardHome from "../../pages/Role/Admin/DashboardHome";
import AdminUserManagement from "../../pages/Role/Admin/AdminUserManagement";
import ProgressReportAdmin from "../../pages/Role/Admin/ProgressReportAdmin";
import StudentPortalAdmin from "../../pages/Role/Admin/StudentPortalAdmin";
import TutoringScheduleAdmin from "../../pages/Role/Admin/TutoringScheduleAdmin";
import LearningPath from "../../pages/Role/Admin/LearningPath";
import LearningPathDetail from "../../pages/Role/Admin/LearningPathDetail";
import PairingManagement from "../../pages/Role/Admin/PairingManagement";
const AdminRoutes = () => {
  return (
    <Routes>
      <Route index element={<DashboardHome />} />
      <Route path="user-management" element={<AdminUserManagement />} />
      <Route path="progress-report" element={<ProgressReportAdmin />} />
      <Route path="student-portal" element={<StudentPortalAdmin />} />
      <Route path="tutoring-schedule" element={<TutoringScheduleAdmin />} />
      <Route path="learning-path" element={<LearningPath />} />
      <Route path="pairings" element={<PairingManagement />} />
      <Route path="learning-path/:id" element={<LearningPathDetail />} />
    </Routes>
  );
};

export default AdminRoutes;
