import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { createClient } from '@supabase/supabase-js';
import CenteredLoading from '@/components/CenterLoading';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string;
const supabase = createClient(supabaseUrl, supabaseAnonKey);

const AuthCallback = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // 处理认证回调
    const handleAuthCallback = async () => {
      const { error } = await supabase.auth.getSession();
      
      if (error) {
        console.error('Error during auth callback:', error.message);
        void navigate('/login');
        return;
      }

      // 认证成功，重定向到首页
      void navigate('/');
    };

    void handleAuthCallback();
  }, [navigate]);

  return (
    <CenteredLoading />
  );
};

export default AuthCallback; 