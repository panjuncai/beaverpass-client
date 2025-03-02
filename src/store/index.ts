import { combineReducers, configureStore } from "@reduxjs/toolkit";
import toastReducer from './slices/toastSlice';
import { postApi } from "@/services/postApi";
import { userApi } from "@/services/userApi";
import { authApi } from '@/services/authApi';
import { orderApi } from '@/services/orderApi';
import { chatApi } from '@/services/chatApi';
import { paymentApi } from '@/services/paymentApi';
// 合并所有的 reducers
const rootReducer = combineReducers({
  toast: toastReducer,
  [userApi.reducerPath]: userApi.reducer,
  [postApi.reducerPath]: postApi.reducer,
  [authApi.reducerPath]: authApi.reducer,
  [orderApi.reducerPath]: orderApi.reducer,
  [chatApi.reducerPath]: chatApi.reducer,
  [paymentApi.reducerPath]: paymentApi.reducer,
});

export const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware()
      .concat(
        userApi.middleware,
        postApi.middleware,
        authApi.middleware,
        orderApi.middleware,
        chatApi.middleware,
        paymentApi.middleware,
      ),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
