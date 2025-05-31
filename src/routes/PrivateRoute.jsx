import { Navigate } from "react-router-dom";
import { useAuth } from "../features/auth/AuthContext";

function PrivateRoute({ children }) {
  const { user } = useAuth();

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return children;
}

export default PrivateRoute;
