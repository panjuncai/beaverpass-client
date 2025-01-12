import { Navigate } from "react-router-dom";

interface PrivateRouteProps {
  element: React.ReactNode;
  isAuthenticated: boolean;
}

export const PrivateRoute: React.FC<PrivateRouteProps> = ({
  element,
  isAuthenticated,
}) => {
  return isAuthenticated ? element : <Navigate to="/login" />;
};
