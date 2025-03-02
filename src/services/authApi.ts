import { User, LoginRequest, RegisterRequest } from '@/types/user';
import { createApiWithBaseUrl } from './api';
import { TAGS } from './api';

// 定义认证状态接口
interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
}

const transformAuthResponse = (user: User | null): AuthState => ({
  isAuthenticated: !!user,
  user,
});

export const authApi = createApiWithBaseUrl('/auth', 'authApi').injectEndpoints({
  endpoints: (builder) => ({
    checkSession: builder.query<AuthState, void>({
      query: () => ({
        url: '/check-session',
        method: 'GET',
      }),
      transformResponse: transformAuthResponse,
      providesTags: [TAGS.Auth],
    }),
    login: builder.mutation<AuthState, LoginRequest>({
      query: (credentials) => ({
        url: '/login',
        method: 'POST',
        data: credentials,
      }),
      transformResponse: transformAuthResponse,
      invalidatesTags: [TAGS.Auth],
    }),
    logout: builder.mutation<AuthState, void>({
      query: () => ({
        url: '/logout',
        method: 'POST',
      }),
      transformResponse: () => transformAuthResponse(null),
      invalidatesTags: [TAGS.Auth],
    }),
    register: builder.mutation<AuthState, RegisterRequest>({
      query: (data) => ({
        url: '/register',
        method: 'POST',
        data,
      }),
      transformResponse: transformAuthResponse,
      invalidatesTags: [TAGS.Auth],
    }),
  }),
});

export const {
  useCheckSessionQuery,
  useLoginMutation,
  useLogoutMutation,
  useRegisterMutation,
} = authApi; 