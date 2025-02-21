import { useSelector, useDispatch } from 'react-redux';
import { type RootState, type AppDispatch } from '@/store';
import { login, logout, setRedirectPath } from '@/store/slices/authSlice';
import type { LoginRequest } from '@/types/user';

/**
 * useAuth 自定义 Hook
 * 用于在任意函数组件中获取 Redux 中的 auth 状态及其操作方法
 */
export const useAuth = () => {
  const dispatch = useDispatch<AppDispatch>();
  // 从 Redux store 中获取 auth 状态
  const { isAuthenticated,loginUser,isLoading, redirectPath } = useSelector(
    (state: RootState) => state.auth
  );

  // 封装登录操作
  const loginHandler = async (data: LoginRequest) => {
    // dispatch 返回的 Promise 支持 unwrap() 方法，方便错误处理
    await dispatch(login(data)).unwrap();
  };

  // 封装登出操作
  const logoutHandler = async () => {
    await dispatch(logout()).unwrap();
  };

  // 封装设置重定向路径操作
  const setRedirect = (path: string) => {
    dispatch(setRedirectPath(path));
  };

  return {
    isAuthenticated,
    loginUser,
    isLoading,
    redirectPath,
    login: loginHandler,
    logout: logoutHandler,
    setRedirectPath: setRedirect,
  };
};
