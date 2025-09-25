import { Navigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

const ProtectedRoute = ({ children, adminOnly = false }) => {
  const { user, isAdmin, loading } = useAuth();

  if (loading) return <div>Loading...</div>; 

  if (!user) return <Navigate to="/login" replace />;

  if (adminOnly && !isAdmin) return <Navigate to="/" replace />;

  if (!adminOnly && isAdmin) return <Navigate to="/dashboard" replace />;

  return children;
};

export default ProtectedRoute;
