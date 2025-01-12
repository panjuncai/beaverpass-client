import react,{ lazy } from "react";
import { RouteConfig } from "@/types/routes";
import { PrivateRoute } from "@/components/PrivateRoute";
import React from "react";

// 页面组件懒加载
// const Register=lazy(()=>import("@/pages/Register/Register"))
const NotFound = lazy(() => import("@/pages/NotFound/NotFound"));
// const Order=lazy(()=>import ("@/pages/Order/Order"))

export const routes: RouteConfig[] = [
  {
    path: "*",
    element:React.createElement(NotFound),
    meta:{requiresAuth:false,title:'404'}
  },
];
