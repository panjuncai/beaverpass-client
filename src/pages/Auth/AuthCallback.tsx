import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createClient } from '@supabase/supabase-js';
import CenteredLoading from '@/components/CenterLoading';
import { useGetCurrentUser } from '@/hooks/userUser';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string;
const supabase = createClient(supabaseUrl, supabaseAnonKey);

const AuthCallback = () => {
  const navigate = useNavigate();
  const { refetch } = useGetCurrentUser();
  const [isProcessing, setIsProcessing] = useState(true);
  const [retryCount, setRetryCount] = useState(0);

  useEffect(() => {
    // 处理认证回调
    const handleAuthCallback = async () => {
      try {
        // 获取会话信息
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error('Error during auth callback:', error.message);
          void navigate('/login');
          return;
        }

        if (session) {
          // 保存 token 到 localStorage
          if (session.access_token) {
            localStorage.setItem('supabase_token', session.access_token);
          }
          
          // 刷新用户信息
          await refetch();
          
          // 认证成功，重定向到首页
          console.log('Auth callback successful, redirecting to home page');
          setIsProcessing(false);
          void navigate('/');
        } else {
          // 如果没有会话，重定向到登录页面
          localStorage.removeItem('supabase_token');
          setIsProcessing(false);
          void navigate('/login');
        }
      } catch (error) {
        console.error('Error in auth callback:', error);
        localStorage.removeItem('supabase_token');
        setIsProcessing(false);
        void navigate('/login');
      }
    };

    void handleAuthCallback();
  }, [navigate, refetch, retryCount]);

  // 如果处理时间过长，尝试重试
  useEffect(() => {
    if (isProcessing) {
      const timer = setTimeout(() => {
        if (retryCount < 3) {
          console.log('Retrying auth callback...');
          setRetryCount(prev => prev + 1);
        } else {
          console.error('Auth callback failed after multiple retries');
          setIsProcessing(false);
          void navigate('/login');
        }
      }, 3000);
      
      return () => clearTimeout(timer);
    }
  }, [isProcessing, retryCount, navigate]);

  return (
    <CenteredLoading />
  );
};

export default AuthCallback; 