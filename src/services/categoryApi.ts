import { createApi } from '@reduxjs/toolkit/query/react';
import { axiosBaseQuery } from '@/api/axiosBaseQuery';
import { Category } from '@/types/category';

export const categoryApi = createApi({
  reducerPath: 'categoryApi',
  baseQuery: axiosBaseQuery({ baseUrl: '/categories' }),
  tagTypes: ['Category'],
  endpoints: (builder) => ({
    // 查询所有的 Category
    getCategories: builder.query<Category[], void>({
      query: () => ({url:'/',method:'GET'}),
      providesTags: (result) =>
        result
          ? [
              // 为返回的每个 category 添加 tag
              ...result.map(({ _id }) => ({ type: 'Category' as const, _id })),
              { type: 'Category', id: 'LIST' },
            ]
          : [{ type: 'Category', id: 'LIST' }],
    }),
    // 查询单个 Category，通过 id 查询
    getCategory: builder.query<Category, string>({
      query: (id) => ({ url: `/${id}`, method: 'GET' }),
      providesTags: (_result, _error, id) => [{ type: 'Category', id }],
    }),
    // 新增 Category
    addCategory: builder.mutation<Category, Partial<Category>>({
      query: (body) => ({
        url: '/',
        method: 'POST',
        body,
      }),
      // 操作后使列表失效，触发重新获取
      invalidatesTags: [{ type: 'Category', id: 'LIST' }],
    }),
    // 更新 Category，使用 PUT 或 PATCH 均可
    updateCategory: builder.mutation<Category, Partial<Category> & Pick<Category, '_id'>>({
      query: ({ _id, ...patch }) => ({
        url: `/${_id}`,
        method: 'PUT', // 或者用 PATCH 方法
        body: patch,
      }),
      invalidatesTags: (_result, _error, { _id }) => [{ type: 'Category', _id }],
    }),
    // 删除 Category
    deleteCategory: builder.mutation<{ success: boolean; id: string }, string>({
      query: (id) => ({
        url: `/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: (_result, _error, id) => [
        { type: 'Category', id },
        { type: 'Category', id: 'LIST' },
      ],
    }),
  }),
});

// 导出自动生成的 Hooks
export const {
  useGetCategoriesQuery,
  useGetCategoryQuery,
  useAddCategoryMutation,
  useUpdateCategoryMutation,
  useDeleteCategoryMutation,
} = categoryApi;
