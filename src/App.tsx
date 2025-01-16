import React, { Suspense } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { routes } from "@/routes";
import { RouteConfig } from "@/types/routes";
import CenteredLoading from "@/components/CenterLoading";
import { useAuth } from "@/hooks/useAuth";

const App: React.FC = () => {
  const { isAuthenticated } = useAuth();
  const renderRoutes = (routes: RouteConfig[]) =>
    routes.map((route) => {
      const { path, element, meta, children } = route;
      if (meta?.requiresAuth && !isAuthenticated) {
        return (
          <Route
            key={path}
            path={path}
            element={<Navigate to="/login" replace />}
          />
        );
      }
      return (
        <Route
          key={path}
          path={path}
          element={
            <Suspense fallback={<CenteredLoading />}>{element}</Suspense>
          }
        >
          {children && renderRoutes(children)}
        </Route>
      );
    });

  return (
    <BrowserRouter>
      <Routes>{renderRoutes(routes)}</Routes>
    </BrowserRouter>
  );
};

export default App;
