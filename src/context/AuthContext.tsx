import React, { createContext, useState, useEffect } from "react";
import { loginUser, logoutUser, getUser } from "@/services/userService";
import { LoginRequest, User } from "@/types/user";
import { useLocation } from "react-router-dom";
import { routes } from "@/routes";
import { RouteConfig } from "@/types/routes";

interface AuthContextType {
  isAuthenticated: boolean;
  user: User | null;
  loading: boolean;
  login: (data: LoginRequest) => Promise<void>;
  logout: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextType>({
  isAuthenticated: false,
  user: null,
  loading: false,
  login: async () => {},
  logout: async () => {},
});

/**
 * AuthProvider
 * @param {Object} props
 * @returns {JSX.Element}
 *
 * 包裹在应用最顶层，管理全局的登录状态、用户信息以及对外提供的登录/登出方法
 */
type AuthProviderProps = React.PropsWithChildren<{}>;
export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const location = useLocation();

  const extractPublicPaths = (routes: RouteConfig[]): string[] => {
    const result: string[] = [];

    const traverse = (routes: RouteConfig[],parentPath="") => {
      for (const route of routes) {
        const fullPath = `${parentPath}${route.path ? route.path : ""}`.replace(/\/+/g, "/");
        // 如果 meta.requiresAuth === false，添加 path
        if (route.meta?.requiresAuth === false && route.path) {
          result.push(fullPath);
        }

        // 如果有子路由，递归处理
        if (route.children && route.children.length > 0) {
          traverse(route.children,`${fullPath}/`);
        }
      }
    };

    traverse(routes);
    return result;
  };

  useEffect(() => {
    const initAuth = async () => {
      try {
        const publicRoutes = extractPublicPaths(routes);
        if (publicRoutes.includes(location.pathname)) {
          setLoading(false);
          return;
        }
        const user: User = await getUser();
        setUser(user);
        setIsAuthenticated(true);
      } catch (e) {
        console.error("No login or token expired:", e);
        // throw e;
      } finally {
        setLoading(false);
      }
    };

    initAuth();
  }, []);

  const handleLogin = async (data: LoginRequest): Promise<void> => {
    try {
      setLoading(true);
      const user = await loginUser(data);
      setUser(user);
      setIsAuthenticated(true);
    } catch (e) {
      throw e;
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async (): Promise<void> => {
    try {
      setLoading(true);
      await logoutUser();
    } catch (e) {
      console.error("Logout error:", e);
      throw e;
    } finally {
      setUser(null);
      setIsAuthenticated(false);
      setLoading(false);
    }
  };

  const value: AuthContextType = {
    isAuthenticated,
    user,
    loading,
    login: handleLogin,
    logout: handleLogout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
