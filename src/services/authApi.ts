import { createApi } from '@reduxjs/toolkit/query/react';
import { axiosBaseQuery } from '../api/axiosBaseQuery';
import type { User } from '@/types/user';

export const authApi = createApi({
  reducerPath: 'authApi',
  baseQuery: axiosBaseQuery({ baseUrl: '/auth' }),
  endpoints: (builder) => ({
    checkSession: builder.query<User, void>({
      query: () => ({
        url: '/check-session',
        method: 'GET',
      }),
    }),
  }),
});

export const { useCheckSessionQuery } = authApi; 