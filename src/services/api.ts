import { createApi } from '@reduxjs/toolkit/query/react';
import { axiosBaseQuery } from '@/api/axiosBaseQuery';

// 定义标签常量
export const TAGS = {
  Post: 'Post'
} as const;

// 创建基础 API slice 工厂函数
export const createApiWithBaseUrl = (baseUrl: string) => createApi({
  reducerPath: 'api',
  baseQuery: axiosBaseQuery({ baseUrl }),
  tagTypes: [TAGS.Post],
  endpoints: () => ({}),
});

// 创建默认 API 实例
export const api = createApiWithBaseUrl('');
export const { resetApiState } = api.util; 