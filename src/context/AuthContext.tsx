import React, { createContext, useState, useEffect } from "react";
import { loginUser, getUser } from "@/services/userService";
import { LoginRequest, User } from "@/types/user";

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

  useEffect(() => {
    const initAuth = async () => {
      try {
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

  const handleLogin = async (data: LoginRequest) => {
    try {
      setLoading(true);
      const user = await loginUser(data);
      setUser(user);
      setIsAuthenticated(true);
    } catch (e) {
      console.error("Login error:", e);
      throw e;
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      setLoading(true);
      // await logoutRequest();
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
