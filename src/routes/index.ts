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
const Post= lazy(() => import("@/pages/Post/Post"));
const Search= lazy(() => import("@/pages/Search/Search"));
const Messages= lazy(() => import("@/pages/Messages/Messages"));
const Deals= lazy(() => import("@/pages/Deals/Deals"));
const Favourites= lazy(() => import("@/pages/Favourites/Favourites"));
const Test= lazy(() => import("@/pages/Test/Test"));
const AppLayout = lazy(() => import("@/layouts/AppLayout"));

export const routes: RouteConfig[] = [
  {
    path: "/",
    element: React.createElement(Navigate,{to:"/search",replace:true}),
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
        element: React.createElement(Order),
        meta: { requiresAuth: true, title: "Order" },
      },
    ],
  },
  {
    path: "/",
    element: React.createElement(AppLayout),
    children: [
      {
        path: "test",
        element: React.createElement(Test),
        meta: { requiresAuth: false, title: "Test" },
      },
    ],
  },
  {
    path: "/",
    element: React.createElement(AppLayout),
    children: [
      {
        path: "search",
        element: React.createElement(Search),
        meta: { requiresAuth:false, title: "Search" },
      },
    ],
  },
  {
    path: "/",
    element: React.createElement(AppLayout),
    children: [
      {
        path: "post",
        element: React.createElement(Post),
        meta: { requiresAuth: true, title: "Post" },
      },
    ],
  },
  {
    path: "/",
    element: React.createElement(AppLayout),
    children: [
      {
        path: "messages",
        element: React.createElement(Messages),
        meta: { requiresAuth: true, title: "Messages" },
      },
    ],
  },
  {
    path: "/",
    element: React.createElement(AppLayout),
    children: [
      {
        path: "deals",
        element: React.createElement(Deals),
        meta: { requiresAuth: true, title: "Deals" },
      },
    ],
  },
  {
    path: "/",
    element: React.createElement(AppLayout),
    children: [
      {
        path: "favourites",
        element: React.createElement(Favourites),
        meta: { requiresAuth: true, title: "favourites" },
      },
    ],
  },
];
