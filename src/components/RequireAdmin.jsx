import { useAuth } from "../features/auth/AuthContext";
import { Navigate } from "react-router-dom";

export default function RequireAdmin({ children }) {
  const { user } = useAuth();

  if (!user || user.email !== "abhicplash@gmail.com") {
    return <Navigate to="/" />;
  }

  return children;
}
