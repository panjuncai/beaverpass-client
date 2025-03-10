import { useMutation, useQuery } from "@apollo/client";
import {
  CHECK_SESSION,
  LOGIN,
  LOGOUT,
  REGISTER,
  VERIFY_USER,
} from "@/api/authOperations";
import type { AuthState, LoginRequest, RegisterRequest,User } from "@/types/user";
import { GraphQLBaseResponse } from "@/types/api";
import { Toast } from "antd-mobile";

// 转换响应为 AuthState
const transformAuthResponse = (user: User | null): AuthState => ({
  isAuthenticated: !!user,
  user,
});

// 检查会话
export const useCheckSession = () => {
  const { data, loading, error, refetch } = useQuery<{
    checkSession: GraphQLBaseResponse<User>;
  }>(CHECK_SESSION, {
    fetchPolicy: "network-only",
    errorPolicy: "all",
  });

  if (error) {
    throw new Error(error.message || 'Check session failed.');
  }

  return {
    data: data
      ? transformAuthResponse(data.checkSession.data || null)
      : { isAuthenticated: false, user: null },
    isLoading: loading,
    error,
    refetch,
  };
};

// 注册
export const useRegister = () => {
  const [registerMutation, { loading }] = useMutation<
    { register: GraphQLBaseResponse<User> },
    { input: RegisterRequest }
  >(REGISTER);

  const register = async (userData: RegisterRequest) => {
    const { data,errors } = await registerMutation({
      variables: { input: userData },
    });

    if (errors && errors.length > 0) {
      throw new Error(errors[0].message || 'Register failed.');   
    }

    if (data?.register.code === 1) {
      Toast.show({ icon: "fail", content: data?.register.msg });
      throw new Error(data?.register.msg);
    } else if (data?.register.code === 0) {
      return transformAuthResponse(data.register.data || null);
    } else {
      throw new Error(data?.register.msg);
    }

    
  };

  return {
    register,
    isLoading: loading,
  };
};

// 登录
export const useLogin = () => {
  const [loginMutation, { loading }] = useMutation<
    { login: GraphQLBaseResponse<User> },
    { input: LoginRequest }
  >(LOGIN);

  const login = async (credentials: LoginRequest) => {
    const { data,errors } = await loginMutation({
      variables: { input: credentials },
    });

    if (errors && errors.length > 0) {
      throw new Error(errors[0].message || 'Login failed.');   
    }

    if (!data || data.login.code !== 0) {
      throw new Error(data?.login.msg);
    }

    return transformAuthResponse(data.login.data || null);
  };

  return {
    login,
    isLoading: loading,
  };
};

// 登出
export const useLogout = () => {
  const [logoutMutation, { loading }] = useMutation<{
    logout: GraphQLBaseResponse;
  }>(LOGOUT);

  const logout = async () => {
    const { data,errors } = await logoutMutation();

    if (!data || data.logout.code !== 0) {
      throw new Error(data?.logout.msg);
    }

    if (errors && errors.length > 0) {
      throw new Error(errors[0].message || 'Logout failed.');   
    }

    return transformAuthResponse(null);
  };

  return {
    logout,
    isLoading: loading,
  };
};

export const useVerifyUser = () => {
    const [verifyUserMutation, { loading }] = useMutation<
      { verifyUser: GraphQLBaseResponse<User> },
      { verificationToken: string }
    >(VERIFY_USER);
  
    const verifyUser = async (verificationToken: string) => {
      const { data,errors } = await verifyUserMutation({
        variables: { verificationToken },
      });
  
      if (!data || data.verifyUser.code !== 0) {
        throw new Error(data?.verifyUser.msg);
      }

      if (errors && errors.length > 0) {
        throw new Error(errors[0].message || 'Verification failed.');   
      }
  
      return data?.verifyUser;
    };
  
  return {
    verifyUser,
    isLoading: loading,
  };
};
