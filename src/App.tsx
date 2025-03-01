import React, { Suspense } from "react";
import {Routes, Route } from "react-router-dom";
import { routes } from "@/routes";
import { RouteConfig } from "@/types/routes";
import CenteredLoading from "@/components/CenterLoading";
import { useAuth } from "@/hooks/useAuth";
import ProtectedRoute from "./routes/ProtectedRoute";

const App: React.FC = () => {
  const { isAuthenticated } = useAuth();

  const renderRoutes = (routes: RouteConfig[]) =>
    routes.map((route) => {
      const { path, element, meta, children } = route;
      return (
        <Route
          key={path}
          path={path}
          element={
            meta?.requiresAuth ? (
              <ProtectedRoute isAuthenticated={isAuthenticated || false}>
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
