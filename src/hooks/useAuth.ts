import { useState, useEffect } from 'react';
import { createClient, Session } from '@supabase/supabase-js';
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
  const [loading, setLoading] = useState(true);

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
        setLoading(false);
      } catch (error) {
        console.error('Error getting initial session:', error);
        setLoading(false);
      }
    };
    
    void initSession();

    // 监听认证状态变化
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
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
      } else if (event === 'SIGNED_OUT') {
        console.log('User signed out');
      }
      
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

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
      
      return data;
    } catch (error) {
      console.error('Login failed:', error);
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
    session,
    isLoading: loading,
    login: loginHandler,
    register: registerHandler,
    logout: logoutHandler,
    socialLogin: socialLoginHandler,
    getToken,
  };
};
