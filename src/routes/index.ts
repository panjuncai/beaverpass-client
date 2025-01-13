import { lazy } from "react";
import { RouteConfig } from "@/types/routes";
import { PrivateRoute } from "@/components/PrivateRoute";
import React from "react";

// 页面组件懒加载
const Register=lazy(()=>import("@/pages/Register/Register"))
const NotFound = lazy(() => import("@/components/NotFound/NotFound"));
const Order = lazy(() => import("@/pages/Order/Order"));

export const routes: RouteConfig[] = [
  {
    path: "/order",
    element: React.createElement(PrivateRoute, {
      element: React.createElement(Order),
      isAuthenticated: true,
    }),
    meta: { requiresAuth: true, title: "Order" },
  },
  {
    path: "/register",
    element: React.createElement(Register),
    meta: { requiresAuth: false, title: "register" },
  },
  {
    path: "*",
    element: React.createElement(NotFound),
    meta: { requiresAuth: false, title: "404" },
  },
];
