import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createClient } from '@supabase/supabase-js';
import CenteredLoading from '@/components/CenterLoading';
import { useGetCurrentUser } from '@/hooks/useUser';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string;
const supabase = createClient(supabaseUrl, supabaseAnonKey);

const AuthCallback = () => {
  const navigate = useNavigate();
  const { refetch } = useGetCurrentUser();
  const [isProcessing, setIsProcessing] = useState(true);
  const [retryCount, setRetryCount] = useState(0);

  useEffect(() => {
    // Handle authentication callback
    const handleAuthCallback = async () => {
      try {
        // Get session information
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error('Error during auth callback:', error.message);
          void navigate('/login');
          return;
        }

        if (session) {
          // Save token to localStorage
          if (session.access_token) {
            localStorage.setItem('supabase_token', session.access_token);
          }
          
          // Refresh user information
          try {
            await refetch();
            console.log('User information refreshed successfully');
          } catch (refreshError) {
            console.error('Error refreshing user information:', refreshError);
            // Continue even if user info refresh fails
            // The user info will be fetched again when needed
          }
          
          // Authentication successful, redirect to home page
          console.log('Auth callback successful, redirecting to home page');
          setIsProcessing(false);
          void navigate('/');
        } else {
          // If no session, redirect to login page
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

  // Retry if processing takes too long
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