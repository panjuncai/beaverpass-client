import { combineReducers, configureStore } from "@reduxjs/toolkit";
import authReducer from "./slices/authSlice";
import toastReducer from './slices/toastSlice';
import { categoryApi } from "@/services/categoryApi";
import { productApi } from "@/services/productApi";
import { postApi } from "@/services/postApi";
import { userApi } from "@/services/userApi";

// 合并所有的 reducers
const rootReducer = combineReducers({
  auth: authReducer,
  toast: toastReducer,
  [categoryApi.reducerPath]: categoryApi.reducer,
  [productApi.reducerPath]: productApi.reducer,
  [userApi.reducerPath]: userApi.reducer,
  [postApi.reducerPath]: postApi.reducer
});

export const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware()
      .concat(
        categoryApi.middleware,
        productApi.middleware,
        userApi.middleware,
        postApi.middleware
      ),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
