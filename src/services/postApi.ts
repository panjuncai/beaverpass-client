import { createApi } from '@reduxjs/toolkit/query/react';
import { axiosBaseQuery } from '../api/axiosBaseQuery';
import { CreatePostRequest, Post } from '../types/post';


export const postApi = createApi({
  reducerPath: 'postApi',
  baseQuery: axiosBaseQuery({ baseUrl: '/posts' }),
  tagTypes: ['Post'],
  endpoints: (builder) => ({
    getPosts: builder.query<Post[], void>({
      query: () => ({
        url: '/',
        method: 'GET',
      }),
      providesTags: ['Post'],
    }),
    
    addPost: builder.mutation<Post, CreatePostRequest>({
      query: (data) => ({
        url: '/',
        method: 'POST',
        data,
      }),
      invalidatesTags: ['Post'],
    }),
    getPost: builder.query<Post, string>({
      query: (id) => ({
        url: `/${id}`,
        method: 'GET',
      }),
    }),
    updatePost: builder.mutation<Post, { postId: string; status: string }>({
      query: ({ postId, status }) => ({
        url: `/${postId}/status`,
        method: 'PATCH',
        data: { status },
      }),
      invalidatesTags: (_result, _error, { postId }) => [
        { type: 'Post', id: postId },
        'Post',
      ],
    }),
  }),
});

export const { useAddPostMutation, useGetPostsQuery, useGetPostQuery, useUpdatePostMutation } = postApi;