import React, { Suspense, useEffect } from "react";
import { Routes, Route } from "react-router-dom";
import { routes } from "@/routes";
import { RouteConfig } from "@/types/routes";
import CenteredLoading from "@/components/CenterLoading";
import { useAuth } from "@/hooks/useAuth";
import { useGetCurrentUser } from "@/hooks/useUser";
import ProtectedRoute from "./routes/ProtectedRoute";

const App: React.FC = () => {
  const {isAuthenticated, isLoading: authLoading } = useAuth();
  const { refetch, loading: userLoading } = useGetCurrentUser();

  // Refresh user information when the application starts
  useEffect(() => {
    if (isAuthenticated) {
      console.log('App: User is authenticated, refreshing user information');
      void refetch();
    }
  }, [refetch, isAuthenticated]);

  // Show loading indicator while authentication state is being determined
  if (authLoading || (isAuthenticated && userLoading)) {
    return <CenteredLoading />;
  }

  const renderRoutes = (routes: RouteConfig[]) =>
    routes.map((route) => {
      const { path, element, meta, children } = route;
      return (
        <Route
          key={path}
          path={path}
          element={
            meta?.requiresAuth ? (
              <ProtectedRoute isAuthenticated={isAuthenticated}>
                <Suspense fallback={<CenteredLoading />}>{element}</Suspense>
              </ProtectedRoute>
            ) : (
              <Suspense fallback={<CenteredLoading />}>{element}</Suspense>
            )
          }
        >
          {children && renderRoutes(children)}
        </Route>
      );
    });

  return <Routes>{renderRoutes(routes)}</Routes>;
};

export default App;
