import { useAuth } from "@/hooks/useAuth";
import React, { useEffect } from "react";
import { Navigate, useLocation } from "react-router-dom";

const ProtectedRoute: React.FC<{
  isAuthenticated: boolean;
  children: React.ReactElement;
}> = ({ isAuthenticated, children }) => {
  const location = useLocation();
  const { setRedirectPath } = useAuth();

  useEffect(() => {
    if (!isAuthenticated) {
      setRedirectPath(location.pathname);
    }
  }, [isAuthenticated, location.pathname, setRedirectPath]);


  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  return children;
};

export default ProtectedRoute;
