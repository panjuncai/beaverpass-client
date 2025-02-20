import { createApi } from '@reduxjs/toolkit/query/react';
import { axiosBaseQuery } from '../api/axiosBaseQuery';

interface CreatePostRequest {
  category: string;
  title: string;
  description: string;
  condition: string;
  images: Record<string, string | null>;
  price: {
    amount: string;
    isFree: boolean;
    isNegotiable: boolean;
  };
  delivery: string;
}

export const postApi = createApi({
  reducerPath: 'postApi',
  baseQuery: axiosBaseQuery({ baseUrl: '/api' }),
  endpoints: (builder) => ({
    createPost: builder.mutation<any, CreatePostRequest>({
      query: (data) => ({
        url: '/posts',
        method: 'POST',
        data,
      }),
    }),
  }),
});

export const { useCreatePostMutation } = postApi;