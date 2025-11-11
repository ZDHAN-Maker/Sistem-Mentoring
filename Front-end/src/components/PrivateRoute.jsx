import { Navigate } from "react-router-dom";
import { useAuth } from "../context/useAuth";

const ProtectedRoute = ({ children, allowedRole }) => {
  const { auth, role, loading } = useAuth();

  if (loading) return <div>Loading...</div>;

  if (!auth) return <Navigate to="/login" />;
  if (allowedRole && allowedRole !== role) return <Navigate to="/" />;

  return children;
};

export default ProtectedRoute;
