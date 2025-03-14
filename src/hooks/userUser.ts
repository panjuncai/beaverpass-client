import {useQuery} from '@apollo/client';
import {createClient} from '@supabase/supabase-js';
import {useEffect, useState} from 'react';
import {
    GET_CURRENT_USER,
} from '@/api/userOperations';
import {User} from '@/types/user';
import { useLocation } from 'react-router-dom';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string;
const supabase = createClient(supabaseUrl, supabaseAnonKey);

// 不需要显示认证错误的路径
const publicPaths = ['/login', '/register', '/auth/callback'];

export const useGetCurrentUser = () => {
    const [hasSession, setHasSession] = useState(false);
    const location = useLocation();
    
    // 检查当前路径是否是公共路径
    const isPublicPath = publicPaths.includes(location.pathname);

    // 检查 Supabase 会话状态
    useEffect(() => {
        const checkSession = async () => {
            try {
                const {data} = await supabase.auth.getSession();
                const hasActiveSession = !!data.session;
                console.log('会话状态检查:', hasActiveSession ? '已登录' : '未登录');
                setHasSession(hasActiveSession);
                
                // 检查 localStorage 中的 token
                const token = localStorage.getItem('supabase_token');
                console.log('本地存储 token 状态:', token ? '存在' : '不存在');
                
                // 如果本地有 token 但没有会话，尝试刷新会话
                if (token && !hasActiveSession) {
                    console.log('检测到 token 但无活跃会话，尝试刷新会话');
                    const { data: refreshData } = await supabase.auth.refreshSession();
                    if (refreshData.session) {
                        console.log('会话刷新成功');
                        setHasSession(true);
                    } else {
                        console.log('会话刷新失败，可能需要重新登录');
                        // token 无效，清除它
                        localStorage.removeItem('supabase_token');
                    }
                }
            } catch (error) {
                console.error('检查会话状态时出错:', error);
            }
        };
        
        void checkSession();
        
        // 监听认证状态变化
        const {data: {subscription}} = supabase.auth.onAuthStateChange((_event, session) => {
            const newSessionState = !!session;
            console.log('认证状态变化:', _event, newSessionState ? '已登录' : '未登录');
            setHasSession(newSessionState);
        });
        
        return () => subscription.unsubscribe();
    }, []);

    const {data, loading, error, refetch} = useQuery<{me: User}>(GET_CURRENT_USER, {
        variables: {},
        fetchPolicy: 'network-only',
        // 只有在有会话时才执行查询
        skip: !hasSession,
        // 发生错误时不缓存结果
        errorPolicy: 'none',
        // 禁用错误通知
        onError: (error) => {
            // 在公共路径上不显示错误
            if (isPublicPath) {
                console.log('在公共路径上忽略用户数据获取错误');
                return;
            }
            
            // 只有在非公共路径上才记录错误
            console.error('获取用户数据时出错:', error);
        }
    });
    
    // 添加日志，帮助调试
    useEffect(() => {
        if (data?.me) {
            console.log('用户数据获取成功:', data.me);
        } else if (loading) {
            console.log('正在获取用户数据...');
        } else if (!hasSession) {
            console.log('跳过用户数据获取 (无会话)');
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