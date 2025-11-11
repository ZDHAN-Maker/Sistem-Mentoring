import { Navigate } from "react-router-dom";
import { useAuth } from "../context/useAuth";

const ProtectedRoute = ({ children, allowedRole }) => {
  const { authData, loading } = useAuth();

  if (loading) return <div>Loading...</div>;

  if (!authData.isAuthenticated) return <Navigate to="/login" />;
  if (allowedRole && allowedRole !== authData.role) return <Navigate to="/" />;

  return children;
};

export default ProtectedRoute;
