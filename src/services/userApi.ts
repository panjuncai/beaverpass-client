import { createApiWithBaseUrl, TAGS } from './api';
import { User } from '@/types/user';

export interface UpdateUserRequest {
  userId: string;
  firstName?: string;
  lastName?: string;
  address?: string;
  avatar?: string;
  phone?: string;
}

const TAG_TYPE = TAGS.User;

export const userApi = createApiWithBaseUrl('/users', 'userApi').injectEndpoints({
  endpoints: (builder) => ({
    getUser: builder.query<User, string>({
      query: (userId) => ({
        url: `/${userId}`,
        method: 'GET',
      }),
      providesTags: [TAG_TYPE],
    }),
    
    updateUser: builder.mutation<User, UpdateUserRequest>({
      query: ({ userId, ...data }) => ({
        url: `/${userId}`,
        method: 'PATCH',
        data,
      }),
      invalidatesTags: [TAG_TYPE],
    }),
  }),
});

export const {
  useGetUserQuery,
  useUpdateUserMutation,
} = userApi;