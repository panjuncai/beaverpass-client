import { CreatePostRequest, Post } from '../types/post';
import { createApiWithBaseUrl, TAGS } from './api';

const TAG_TYPE = { type: TAGS.Post };

// 创建带有特定 baseUrl 的 API 实例
export const postApi = createApiWithBaseUrl('/posts').injectEndpoints({
  endpoints: (builder) => ({
    getPosts: builder.query<Post[], void>({
      query: () => ({
        url: '/',  // 现在可以使用相对路径
        method: 'GET',
      }),
      providesTags: [TAG_TYPE],
    }),
    
    getUserPosts: builder.query<Post[], void>({
      query: () => ({
        url: '/me',
        method: 'GET',
      }),
      providesTags: [TAG_TYPE],
    }),

    getPost: builder.query<Post, string>({
      query: (id) => ({
        url: `/${id}`,
        method: 'GET',
      }),
    }),

    addPost: builder.mutation<Post, CreatePostRequest>({
      query: (data) => ({
        url: '/',
        method: 'POST',
        data,
      }),
      invalidatesTags: [TAG_TYPE],
    }),

    updatePost: builder.mutation<Post, { postId: string; status: string }>({
      query: ({ postId, status }) => ({
        url: `/${postId}/status`,
        method: 'PATCH',
        data: { status },
      }),
      invalidatesTags: [TAG_TYPE],
    }),
  }),
});

export const {
  useGetPostsQuery,
  useGetPostQuery,
  useAddPostMutation,
  useUpdatePostMutation,
  useGetUserPostsQuery,
} = postApi;