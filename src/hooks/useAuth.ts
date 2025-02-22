import { useSelector, useDispatch } from 'react-redux';
import { type RootState, type AppDispatch } from '@/store';
import { login, logout, setRedirectPath } from '@/store/slices/authSlice';
import type { LoginRequest } from '@/types/user';
import { useCheckSessionQuery } from '@/services/authApi';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
/**
 * useAuth 自定义 Hook
 * 用于在任意函数组件中获取 Redux 中的 auth 状态及其操作方法
 */
export const useAuth = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  // 从 Redux store 中获取 auth 状态
  const { isAuthenticated,loginUser,isLoading, redirectPath } = useSelector(
    (state: RootState) => state.auth
  );

  // 添加一个跳过 session 检查的标志
  const [skipSessionCheck, setSkipSessionCheck] = useState(false);

  const { data: sessionUser, isSuccess } = useCheckSessionQuery(undefined, {
    skip: skipSessionCheck // 当 skipSessionCheck 为 true 时跳过查询
  });

  // 使用 useEffect 来同步状态
  useEffect(() => {
    if (isSuccess && sessionUser && !skipSessionCheck) {
      dispatch({
        type: 'auth/setAuthState',
        payload: {
          isAuthenticated: true,
          user: sessionUser
        }
      });
    }
  }, [sessionUser, isSuccess, dispatch, skipSessionCheck]);

  // 封装登录操作
  const loginHandler = async (data: LoginRequest) => {
    // dispatch 返回的 Promise 支持 unwrap() 方法，方便错误处理
    await dispatch(login(data)).unwrap();
  };

  // 封装登出操作
  const logoutHandler = async () => {
    try {
      await dispatch(logout()).unwrap();
      setSkipSessionCheck(true); // 登出后跳过 session 检查
      dispatch({
        type: 'auth/setAuthState',
        payload: {
          isAuthenticated: false,
          user: null,
          isLoading: false
        }
      });
      void navigate("/search");
    } catch (error: unknown) {
      const err = error instanceof Error ? error.message : 'Unknown error';
      console.error('Logout failed:', err);
      throw new Error(err);
    }
  };

  // 封装设置重定向路径操作
  const setRedirect = (path: string) => {
    dispatch(setRedirectPath(path));
  };

  return {
    isAuthenticated: isAuthenticated || (!skipSessionCheck && isSuccess && !!sessionUser) || false,
    loginUser: loginUser || (!skipSessionCheck ? sessionUser : null),
    isLoading,
    redirectPath,
    login: loginHandler,
    logout: logoutHandler,
    setRedirectPath: setRedirect,
  };
};
