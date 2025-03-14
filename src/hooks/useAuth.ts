import { useState, useEffect } from 'react';
import { createClient, Session } from '@supabase/supabase-js';
import { LoginRequest, RegisterRequest } from '@/types/user';
import { useGetCurrentUser } from './userUser';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string;
const supabase = createClient(supabaseUrl, supabaseAnonKey);

/**
 * useAuth 自定义 Hook
 * 使用 Supabase 管理认证状态
 */
export const useAuth = () => {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const { user, refetch } = useGetCurrentUser();

  // 保存 token 到 localStorage
  const saveToken = (session: Session | null) => {
    if (session?.access_token) {
      localStorage.setItem('supabase_token', session.access_token);
    } else {
      localStorage.removeItem('supabase_token');
    }
  };

  // 获取当前 token
  const getToken = (): string | null => {
    return localStorage.getItem('supabase_token');
  };

  useEffect(() => {
    // 获取初始会话状态
    const initSession = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        setSession(session);
        saveToken(session);
        
        // 如果有会话，刷新用户信息
        if (session) {
          await refetch();
        }
        
        setLoading(false);
      } catch (error) {
        console.error('Error getting initial session:', error);
        setLoading(false);
      }
    };
    
    void initSession();

    // 监听认证状态变化
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log('Auth state changed:', event, session?.user?.email);
      
      // 更新会话状态
      setSession(session);
      
      // 保存 token
      saveToken(session);
      
      // 根据不同事件类型处理
      if (event === 'TOKEN_REFRESHED') {
        console.log('Token refreshed, new token saved');
      } else if (event === 'SIGNED_IN') {
        console.log('User signed in');
        // 登录成功后立即刷新用户信息
        if (session) {
          try {
            await refetch();
          } catch (error) {
            console.error('Error fetching user after sign in:', error);
          }
        }
      } else if (event === 'SIGNED_OUT') {
        console.log('User signed out');
      }
      
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, [refetch]);

  // 登录处理
  const loginHandler = async (input: LoginRequest) => {
    setLoading(true);
    try {
      // 使用 Supabase Auth 登录
      const { data, error } = await supabase.auth.signInWithPassword({
        email: input.email,
        password: input.password,
      });
      
      if (error) throw error;
      
      // 保存 token
      if (data.session) {
        saveToken(data.session);
        // 立即更新会话状态
        setSession(data.session);
      }
      
      // 添加短暂延迟，确保会话状态已更新
      await new Promise(resolve => setTimeout(resolve, 100));
      
      // 尝试多次获取用户信息
      let retryCount = 0;
      let userData = null;
      
      while (!userData && retryCount < 3) {
        try {
          console.log(`尝试获取用户信息，第 ${retryCount + 1} 次`);
          const result = await refetch();
          userData = result.data?.me;
          
          if (userData) {
            console.log('用户信息获取成功:', userData);
            break;
          }
        } catch (fetchError) {
          console.error(`获取用户信息失败，第 ${retryCount + 1} 次:`, fetchError);
        }
        
        retryCount++;
        
        if (retryCount < 3) {
          // 等待一段时间后重试
          await new Promise(resolve => setTimeout(resolve, 300));
        }
      }
      
      return data;
    } catch (error) {
      console.error('登录失败:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // 注册处理
  const registerHandler = async (input: RegisterRequest) => {
    setLoading(true);
    try {
      // 使用 Supabase Auth 注册
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
      
      // 保存 token
      if (data.session) {
        saveToken(data.session);
      }
      
      return data;
    } catch (error) {
      console.error('Registration failed:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // 登出处理
  const logoutHandler = async () => {
    setLoading(true);
    try {
      // 先清除会话，确保本地状态更新
      setSession(null);
      
      // 清除 token
      localStorage.removeItem('supabase_token');
      
      // 执行 Supabase 登出
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      
      // 重定向到登录页面
      window.location.href = '/login';
      
      return true;
    } catch (error) {
      console.error('Logout failed:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // 社交登录处理
  const socialLoginHandler = async (provider: 'google' | 'apple' | 'facebook') => {
    try {
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider,
        options: {
          redirectTo: `${window.location.origin}/auth/callback`
        }
      });
      
      if (error) throw error;
      
      return data;
    } catch (error) {
      console.error(`${provider} login failed:`, error);
      throw error;
    }
  };

  return {
    isAuthenticated: !!session,
    loginUser: user,
    session,
    isLoading: loading,
    login: loginHandler,
    register: registerHandler,
    logout: logoutHandler,
    socialLogin: socialLoginHandler,
    getToken,
  };
};
