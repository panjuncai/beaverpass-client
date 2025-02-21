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
  }),
});

export const { useAddPostMutation, useGetPostsQuery, useGetPostQuery } = postApi;