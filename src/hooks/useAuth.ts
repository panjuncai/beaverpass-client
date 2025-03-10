import type { LoginRequest } from '@/types/user';
import { useNavigate } from 'react-router-dom';
import { useCheckSession, useLogin, useLogout } from '@/services/authService';
import { useApolloClient } from '@apollo/client';

/**
 * useAuth 自定义 Hook
 * 使用 GraphQL 管理认证状态
 */
export const useAuth = () => {
  const navigate = useNavigate();
  const apolloClient = useApolloClient();
  
  // 使用 GraphQL 查询检查会话状态
  const { data: authState, isLoading: isSessionLoading, refetch } = useCheckSession();
  
  // 使用 GraphQL 变更进行登录和登出
  const { login: loginMutation, isLoading: isLoginLoading } = useLogin();
  const { logout: logoutMutation, isLoading: isLogoutLoading } = useLogout();

  // 封装登录操作
  const loginHandler = async (data: LoginRequest) => {
    try {
      const result = await loginMutation(data);
      // 登录成功后刷新会话状态
      await refetch();
      return result;
    } catch (error) {
      console.error('Login failed:', error);
      throw error;
    }
  };

  // 封装登出操作
  const logoutHandler = async () => {
    try {
      const result = await logoutMutation();
      
      // 重置 Apollo 缓存
      await apolloClient.resetStore();
      
      // 导航到搜索页面
      void navigate("/search", { replace: true });
      return result;
    } catch (error) {
      console.error('Logout failed:', error);
      throw error;
    }
  };

  // 手动验证会话
  const verifySession = async () => {
    return await refetch();
  };

  return {
    isAuthenticated: authState.isAuthenticated,
    loginUser: authState.user,
    isLoading: isSessionLoading || isLoginLoading || isLogoutLoading,
    login: loginHandler,
    logout: logoutHandler,
    verifySession,
  };
};
