import { useContext } from 'react';
import { AuthContext } from '@/context/AuthContext';

/**
 * useAuth 自定义 Hook
 * 用于在任意函数组件中获取 AuthContext 提供的状态与方法
 */
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be in AuthProvider');
  }
  return context;
};
