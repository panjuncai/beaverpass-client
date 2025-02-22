import { combineReducers, configureStore } from "@reduxjs/toolkit";
import authReducer from "./slices/authSlice";
import toastReducer from './slices/toastSlice';
import { productApi } from "@/services/productApi";
import { postApi } from "@/services/postApi";
import { userApi } from "@/services/userApi";
import { authApi } from '@/services/authApi';
import { orderApi } from '@/services/orderApi';

// 合并所有的 reducers
const rootReducer = combineReducers({
  auth: authReducer,
  toast: toastReducer,
  [productApi.reducerPath]: productApi.reducer,
  [userApi.reducerPath]: userApi.reducer,
  [postApi.reducerPath]: postApi.reducer,
  [authApi.reducerPath]: authApi.reducer,
  [orderApi.reducerPath]: orderApi.reducer
});

export const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware()
      .concat(
        productApi.middleware,
        userApi.middleware,
        postApi.middleware,
        authApi.middleware,
        orderApi.middleware
      ),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
