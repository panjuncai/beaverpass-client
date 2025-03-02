import React from "react";
import { Navigate, } from "react-router-dom";

const ProtectedRoute: React.FC<{
  isAuthenticated: boolean;
  children: React.ReactElement;
}> = ({ isAuthenticated, children }) => {

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  return children;
};

export default ProtectedRoute;
