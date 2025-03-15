import {useQuery} from '@apollo/client';
import {createClient} from '@supabase/supabase-js';
import {useEffect, useState} from 'react';
import {
    GET_CURRENT_USER,
    GET_USER_BY_ID,
} from '@/api/userOperations';
import {User} from '@/types/user';
import { useLocation } from 'react-router-dom';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string;
const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Paths that don't need to show authentication errors
const publicPaths = ['/login', '/register', '/auth/callback'];

export const useGetCurrentUser = () => {
    const [hasSession, setHasSession] = useState(false);
    const location = useLocation();
    
    // Check if current path is a public path
    const isPublicPath = publicPaths.includes(location.pathname);

    // Check Supabase session status
    useEffect(() => {
        const checkSession = async () => {
            try {
                const {data} = await supabase.auth.getSession();
                const hasActiveSession = !!data.session;
                console.log('Session status check:', hasActiveSession ? 'Logged in' : 'Not logged in');
                setHasSession(hasActiveSession);
                
                // Check for token in localStorage
                const token = localStorage.getItem('supabase_token');
                console.log('Local storage token status:', token ? 'Exists' : 'Does not exist');
                
                // If there's a token but no active session, try to refresh the session
                if (token && !hasActiveSession) {
                    console.log('Token detected but no active session, attempting to refresh session');
                    const { data: refreshData } = await supabase.auth.refreshSession();
                    if (refreshData.session) {
                        console.log('Session refresh successful');
                        setHasSession(true);
                    } else {
                        console.log('Session refresh failed, may need to log in again');
                        // Token is invalid, clear it
                        localStorage.removeItem('supabase_token');
                    }
                }
            } catch (error) {
                console.error('Error checking session status:', error);
            }
        };
        
        void checkSession();
        
        // Listen for authentication state changes
        const {data: {subscription}} = supabase.auth.onAuthStateChange((_event, session) => {
            const newSessionState = !!session;
            console.log('Auth state change:', _event, newSessionState ? 'Logged in' : 'Not logged in');
            setHasSession(newSessionState);
        });
        
        return () => subscription.unsubscribe();
    }, []);

    const {data, loading, error, refetch} = useQuery<{me: User}>(GET_CURRENT_USER, {
        variables: {},
        fetchPolicy: 'network-only',
        // Only execute the query if there's a session
        skip: !hasSession,
        // Don't cache results on error
        errorPolicy: 'none',
        // Disable error notifications
        onError: (error) => {
            // Don't show errors on public paths
            if (isPublicPath) {
                console.log('Ignoring user data fetch error on public path');
                return;
            }
            
            // Only log errors on non-public paths
            console.error('Error fetching user data:', error);
        }
    });
    
    // Add logging to help with debugging
    useEffect(() => {
        if (data?.me) {
            console.log('User data fetched successfully:', data.me);
        } else if (loading) {
            console.log('Fetching user data...');
        } else if (!hasSession) {
            console.log('Skipping user data fetch (no session)');
        }
    }, [data, loading, hasSession]);
    
    return {
        user: data?.me,
        loading,
        error,
        refetch,
        hasSession,
    };
};

export const useGetUserById = (id: string) => {
    const {data, loading, error, refetch} = useQuery<{user: User}>(GET_USER_BY_ID, {
        variables: {id},
        fetchPolicy: 'network-only'
    });
    
    return {
        user: data?.user,
        loading,
        error,
        refetch,
    };
};