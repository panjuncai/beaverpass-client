import { lazy } from "react";
import { RouteConfig } from "@/types/routes";
import { Navigate } from "react-router-dom";
import React from "react";
import Logo  from "@/components/Logo/Logo";

// 页面组件懒加载
const Register = lazy(() => import("@/pages/Register/Register"));
const VerifyEmail = lazy(() => import("@/pages/VerifyEmail/VerifyEmail"));
const Login = lazy(() => import("@/pages/Login/Login"));
const NotFound = lazy(() => import("@/components/NotFound/NotFound"));
const Order = lazy(() => import("@/pages/Order/Order"));
const Post= lazy(() => import("@/pages/Post/Post"));
const Search= lazy(() => import("@/pages/Search/Search"));
const Inbox= lazy(() => import("@/pages/Inbox/Inbox"));
const Deals= lazy(() => import("@/pages/Deals/Deals"));
const Test= lazy(() => import("@/pages/Test/Test"));
const AppLayout = lazy(() => import("@/layouts/AppLayout"));
const PostDetailWrapper = lazy(() => import("@/pages/PostDetail/PostDetailWrapper"));
const OrderView= lazy(() => import("@/pages/OrderView/OrderView"));
const Chat= lazy(() => import("@/pages/Chat/Chat"));

export const routes: RouteConfig[] = [
  {
    path: "/",
    element: React.createElement(Navigate,{to:"/search",replace:true}),
    meta: { requiresAuth: false, title: "Search" },
  },
  {
    path:"/posts/:postId",
    element:React.createElement(PostDetailWrapper),
    meta:{
      requiresAuth:false,
      title:"Post Detail"
    }
  },
  {
    path: "/",
    element: React.createElement(AppLayout, { 
      showBack: false, 
      title: React.createElement(Logo, { height: 60, width: 225 }),
      showNavBar:true 
    }),
    children: [
      {
        path: "search",
        element: React.createElement(Search),
        meta: { requiresAuth: false, title: "Search" },
      },
    ],
  },
  {
    path: "/",
    element: React.createElement(AppLayout, { 
      showBack: true, 
      title: "Chat",
      showNavBar: true 
    }),
    children: [
      {
        path: "/chat/:roomId",
        element: React.createElement(Chat),
        meta: { requiresAuth: true, title: "Chat" },
      },
    ],
  },
  // {
  //   path:"/chat/:roomId",
  //   element:React.createElement(Chat),
  //   meta:{
  //     requiresAuth:false,
  //     title:"Chat"
  //   }
  // },
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
        path: "orderView",
        element: React.createElement(OrderView),
        meta: { requiresAuth: true, title: "Order View" },
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
    element: React.createElement(AppLayout, { showBack: true, title: "Post" }),
    children: [
      {
        path: "post",
        element: React.createElement(Post),
        meta: { requiresAuth: false, title: "Post" },
      },
    ],
  },
  {
    path: "/",
    element: React.createElement(AppLayout, { showBack: true, title: "Inbox" }),
    children: [
      {
        path: "inbox",
        element: React.createElement(Inbox),
        meta: { requiresAuth: false, title: "Inbox" },
      },
    ],
  },
  {
    path: "/",
    element: React.createElement(AppLayout, { showBack: true, title: "Deals" }),
    children: [
      {
        path: "deals",
        element: React.createElement(Deals),
        meta: { requiresAuth: false, title: "Deals" },
      },
    ],
  },
];
