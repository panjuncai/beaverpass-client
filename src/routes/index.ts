import { lazy } from "react";
import { RouteConfig } from "@/types/routes";
import { PrivateRoute } from "@/components/PrivateRoute";
import { Navigate } from "react-router-dom";
import React from "react";

// 页面组件懒加载
const Register = lazy(() => import("@/pages/Register/Register"));
const VerifyEmail = lazy(() => import("@/pages/VerifyEmail/VerifyEmail"));
const Login = lazy(() => import("@/pages/Login/Login"));
const NotFound = lazy(() => import("@/components/NotFound/NotFound"));
const Order = lazy(() => import("@/pages/Order/Order"));
const Search = lazy(() => import("@/pages/Search/Search"));
const AppLayout = lazy(() => import("@/layouts/AppLayout"));

export const routes: RouteConfig[] = [
  {
    path: "/",
    element: React.createElement(Navigate,{to:"/search",replace:true})
  },
  {
    path: "/search",
    element: React.createElement(Search),
    meta: { requiresAuth: false, title: "Search" },
  },
  {
    path: "/register",
    element: React.createElement(Register),
    meta: { requiresAuth: false, title: "register" },
  },
  {
    path: "/verifyEmail",
    element: React.createElement(VerifyEmail),
    meta: { requiresAuth: false, title: "Verify Email" },
  },
  {
    path: "/login",
    element: React.createElement(Login),
    meta: { requiresAuth: false, title: "login" },
  },
  {
    path: "*",
    element: React.createElement(NotFound),
    meta: { requiresAuth: false, title: "404" },
  },
  {
    path: "/",
    element: React.createElement(AppLayout),
    children: [
      {
        path: "order",
        element: React.createElement(PrivateRoute, {
          element: React.createElement(Order),
          isAuthenticated: true,
        }),
        meta: { requiresAuth: true, title: "Order" },
      },
    ],
  },
];
