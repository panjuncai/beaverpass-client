import { createApi } from '@reduxjs/toolkit/query/react';
import { axiosBaseQuery } from '../api/axiosBaseQuery';
import { Order, CreateOrderRequest } from '@/types/order';

export const orderApi = createApi({
  reducerPath: 'orderApi',
  baseQuery: axiosBaseQuery({ baseUrl: '/orders' }),
  tagTypes: ['Order'],
  endpoints: (builder) => ({
    getOrders: builder.query<Order[], void>({
      query: () => ({
        url: '/',
        method: 'GET',
      }),
      providesTags: ['Order'],
    }),
    createOrder: builder.mutation<Order, CreateOrderRequest>({
      query: (data) => ({
        url: '/',
        method: 'POST',
        data,
      }),
      invalidatesTags: ['Order'],
    }),
  }),
});

export const { useCreateOrderMutation, useGetOrdersQuery } = orderApi; 