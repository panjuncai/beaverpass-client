import { usePageTitle } from "./hooks/usePageTitle";
import React, { Suspense } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { routes } from "@/routes";
import { RouteConfig } from "@/types/routes";

const App: React.FC = () => {
  // usePageTitle()
  const renderRoutes = (routes: RouteConfig[]) =>
    routes.map((route) => (
      <Route
        key={route.path}
        path={route.path}
        element={
          <Suspense fallback={<div>Loading...</div>}>
            {route.element}
          </Suspense>
        }
      >
        {route.children && renderRoutes(route.children)}
      </Route>
    ));

  return (
    <BrowserRouter>
      <Routes>{renderRoutes(routes)}</Routes>
    </BrowserRouter>
  );
};

export default App;
