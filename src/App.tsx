import React, { Suspense, useEffect } from "react";
import { Routes, Route } from "react-router-dom";
import { routes } from "@/routes";
import { RouteConfig } from "@/types/routes";
import CenteredLoading from "@/components/CenterLoading";
import { useAuth } from "@/hooks/useAuth";
import { useGetCurrentUser } from "@/hooks/userUser";
import ProtectedRoute from "./routes/ProtectedRoute";

const App: React.FC = () => {
  const { isAuthenticated, isLoading: authLoading } = useAuth();
  const { refetch } = useGetCurrentUser();

  // 应用启动时刷新用户信息
  useEffect(() => {
    void refetch();
  }, [refetch]);

  // 如果认证状态正在加载，显示加载中
  if (authLoading) {
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
