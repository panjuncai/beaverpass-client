import type { LoginRequest } from '@/types/user';
import { useNavigate } from 'react-router-dom';
import { api } from '@/services/api';
import { 
  useLoginMutation, 
  useLogoutMutation, 
  useCheckSessionQuery,
} from '@/services/authApi';
import { useState, useEffect } from 'react';

/**
 * useAuth 自定义 Hook
 * 使用 RTK Query 管理认证状态
 */
export const useAuth = () => {
  const navigate = useNavigate();
  const [isUserAuthenticated, setIsUserAuthenticated] = useState(false);
  
  // 使用 RTK Query 的全局状态
  const { data: authState, isLoading: isSessionLoading } = useCheckSessionQuery(undefined, {
    pollingInterval: isUserAuthenticated ? 6 * 1000 : undefined,
  });
  
  // 当 authState 变化时更新认证状态
  useEffect(() => {
    setIsUserAuthenticated(!!authState?.isAuthenticated);
  }, [authState?.isAuthenticated]);

  const [login, { isLoading: isLoginLoading }] = useLoginMutation();
  const [logout, { isLoading: isLogoutLoading }] = useLogoutMutation();

  // 封装登录操作
  const loginHandler = async (data: LoginRequest) => {
    const result = await login(data).unwrap();
    return result;
  };

  // 封装登出操作
  const logoutHandler = async () => {
    try {
      const result = await logout().unwrap();
      
      // 重置所有 API 缓存
      api.util.resetApiState();
      void navigate("/search", { replace: true });
      return result;
    } catch (error) {
      console.error('Logout failed:', error);
      throw new Error('Logout failed');
    }
  };

  return {
    isAuthenticated: authState?.isAuthenticated ?? false,
    loginUser: authState?.user ?? null,
    isLoading: isSessionLoading || isLoginLoading || isLogoutLoading,
    login: loginHandler,
    logout: logoutHandler,
  };
};
