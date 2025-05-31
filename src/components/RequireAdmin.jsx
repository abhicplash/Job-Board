import React from "react";
import { Navigate } from "react-router-dom";
import { useUserRole } from "../hooks/useUserRole";

const RequireAdmin = ({ children }) => {
  const role = useUserRole();

  if (role === null) return <p>Loading...</p>;

  if (role !== "admin") {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default RequireAdmin;
