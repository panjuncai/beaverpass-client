import { createApi } from '@reduxjs/toolkit/query/react';
import { axiosBaseQuery } from '@/api/axiosBaseQuery';

// 定义标签常量
export const TAGS = {
  Post: 'Post',
  Chat: 'Chat',
  User: 'User',
} as const;


// 创建基础 API slice 工厂函数
export const createApiWithBaseUrl = (baseUrl: string, path: string) => createApi({
  reducerPath: path,  // 使用传入的路径作为 reducerPath
  baseQuery: axiosBaseQuery({ baseUrl }),
  tagTypes: [TAGS.Post, TAGS.Chat, TAGS.User],
  endpoints: () => ({}),
});

// 创建默认 API 实例
export const api = createApiWithBaseUrl('', 'baseApi');
export const { resetApiState } = api.util;
