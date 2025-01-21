// import { routes } from "@/routes";
// import { RouteConfig } from "@/types/routes";
// import { useEffect } from "react";
// import { useLocation } from "react-router-dom"


// const flattenRoutes = (routes:RouteConfig, parentPath = '') => {
//     return routes.reduce((acc, route) => {
//         const currentPath = `${parentPath}${route.path}`;
//         acc.push({ ...route, fullPath: currentPath });

//         if (route.children) {
//             acc.push(...flattenRoutes(route.children, currentPath));
//         }

//         return acc;
//     }, []);
// };

// export const usePageTitle = (): void => {
//     const location = useLocation();
//     const flatRoutes = flattenRoutes(routes);

//     useEffect(() => {
//         const match = flatRoutes.find((route) => {
//             if (!route.fullPath) {
//                 return false;
//             }
//             return new RegExp(`^${route.fullPath}$`).test(location.pathname);
//         });

//         if (match?.meta?.title) {
//             document.title = match.meta.title;
//         }
//     }, [location, flatRoutes]);
// };