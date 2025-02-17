import { createApi } from '@reduxjs/toolkit/query/react';
import { axiosBaseQuery } from '@/api/axiosBaseQuery';
import { Product} from '@/types/product';

export const productApi = createApi({
  reducerPath: 'productApi',
  baseQuery: axiosBaseQuery({ baseUrl: '/products' }),
  tagTypes: ['product'],
  endpoints: (builder) => ({
    // 查询所有的 product
    getProducts: builder.query<Product[], void>({
      query: () => ({url:'/',method:'GET'}),
      providesTags: (result) =>
        result
          ? [
              // 为返回的每个 product 添加 tag
              ...result.map(({ _id }) => ({ type: 'product' as const, _id })),
              { type: 'product', id: 'LIST' },
            ]
          : [{ type: 'product', id: 'LIST' }],
    }),
    // 查询单个 product，通过 id 查询
    getProduct: builder.query<Product, string>({
      query: (id) => ({ url: `/${id}`, method: 'GET' }),
      providesTags: (_result, _error, id) => [{ type: 'product', id }],
    }),
    // 新增 product
    addProduct: builder.mutation<Product, Partial<Product>>({
      query: (body) => ({
        url: '/',
        method: 'POST',
        body,
      }),
      // 操作后使列表失效，触发重新获取
      invalidatesTags: [{ type: 'product', id: 'LIST' }],
    }),
    // 更新 product，使用 PUT 或 PATCH 均可
    updateProduct: builder.mutation<Product, Partial<Product> & Pick<Product, '_id'>>({
      query: ({ _id, ...patch }) => ({
        url: `/${_id}`,
        method: 'PUT', // 或者用 PATCH 方法
        body: patch,
      }),
      invalidatesTags: (_result, _error, { _id }) => [{ type: 'product', _id }],
    }),
    // 删除 product
    deleteProduct: builder.mutation<{ success: boolean; id: string }, string>({
      query: (id) => ({
        url: `/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: (_result, _error, id) => [
        { type: 'product', id },
        { type: 'product', id: 'LIST' },
      ],
    }),
  }),
});

// 导出自动生成的 Hooks
export const {
  useGetProductsQuery,
  useGetProductQuery,
  useAddProductMutation,
  useUpdateProductMutation,
  useDeleteProductMutation,
} = productApi;
