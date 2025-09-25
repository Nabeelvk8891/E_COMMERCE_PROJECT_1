import { Navigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

const HomeRoute = ({ children }) => {
  const { user } = useAuth();

  if (user?.role?.toLowerCase() === "admin") {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
};

export default HomeRoute;
