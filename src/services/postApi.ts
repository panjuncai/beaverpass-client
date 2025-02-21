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

interface CreatePostResponse {
  id: string;
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
  createdAt: string;
}

export const postApi = createApi({
  reducerPath: 'postApi',
  baseQuery: axiosBaseQuery({ baseUrl: '/posts' }),
  endpoints: (builder) => ({
    addPost: builder.mutation<CreatePostResponse, CreatePostRequest>({
      query: (data) => ({
        url: '/',
        method: 'POST',
        data,
      }),
    }),
  }),
});

export const { useAddPostMutation } = postApi;