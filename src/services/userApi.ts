import { createApiWithBaseUrl, TAGS } from './api';

export interface User {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  address?: string;
  avatar?: string;
}

export interface UpdateUserRequest {
  userId: string;
  firstName?: string;
  lastName?: string;
  address?: string;
  avatar?: string;
}

const TAG_TYPE = TAGS.User;

export const userApi = createApiWithBaseUrl('/users', 'userApi').injectEndpoints({
  endpoints: (builder) => ({
    getUser: builder.query<User, string>({
      query: (userId) => ({
        url: `/${userId}/profile`,
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