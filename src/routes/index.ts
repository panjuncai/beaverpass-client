import { lazy } from "react";
import { RouteConfig } from "@/types/routes";
import { Navigate } from "react-router-dom";
import React from "react";

// 页面组件懒加载
const Register = lazy(() => import("@/pages/Register/Register"));
const VerifyEmail = lazy(() => import("@/pages/VerifyEmail/VerifyEmail"));
const Login = lazy(() => import("@/pages/Login/Login"));
const NotFound = lazy(() => import("@/components/NotFound/NotFound"));
const Order = lazy(() => import("@/pages/Order/Order"));
const Test= lazy(() => import("@/pages/Test/Test"));
const AppLayout = lazy(() => import("@/layouts/AppLayout"));

export const routes: RouteConfig[] = [
  {
    path: "/",
    element: React.createElement(Navigate,{to:"/test",replace:true})
  },
  {
    path: "/test",
    element: React.createElement(Test),
    meta: { requiresAuth: false, title: "Test" },
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
        element: React.createElement(Order),
        meta: { requiresAuth: true, title: "Order" },
      },
    ],
  },
];
