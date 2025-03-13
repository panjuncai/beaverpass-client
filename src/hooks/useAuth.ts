// import type { LoginRequest } from '@/types/user';
// import { useNavigate } from 'react-router-dom';
// import { useCheckSession, useLogin, useLogout } from '@/services/authService';
// import { useApolloClient } from '@apollo/client';
import { useState, useEffect } from 'react';
import { createClient, Session, User } from '@supabase/supabase-js';
import { LoginRequest, RegisterRequest } from '@/types/user';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string;
const supabase = createClient(supabaseUrl, supabaseAnonKey);

/**
 * useAuth 自定义 Hook
 * 使用 Supabase 管理认证状态
 */
export const useAuth = () => {
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // 获取初始会话状态
    void supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setIsLoading(false);
    });

    // 监听认证状态变化
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setIsLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  // const navigate = useNavigate();
  // const apolloClient = useApolloClient();
  
  // // 使用 GraphQL 查询检查会话状态
  // const { data: authState, isLoading: isSessionLoading, refetch } = useCheckSession();
  
  // // 使用 GraphQL 变更进行登录和登出
  // const { login: loginMutation, isLoading: isLoginLoading } = useLogin();
  // const { logout: logoutMutation, isLoading: isLogoutLoading } = useLogout();

  // 登录处理
  const loginHandler = async (input: LoginRequest) => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: input.email,
        password: input.password,
      });
      
      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Login failed:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // 注册处理
  const registerHandler = async (input: RegisterRequest) => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase.auth.signUp({
        email: input.email,
        password: input.password,
        options: {
          data: {
            firstName: input.firstName,
            lastName: input.lastName,
          }
        }
      });
      
      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Registration failed:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // 登出处理
  const logoutHandler = async () => {
    setIsLoading(true);
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
    } catch (error) {
      console.error('Logout failed:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // // 手动验证会话
  // const verifySession = async () => {
  //   return await refetch();
  // };

  return {
    isAuthenticated: !!session,
    user: session?.user ?? null,
    session,
    isLoading,
    login: loginHandler,
    register: registerHandler,
    logout: logoutHandler,
  };
};
