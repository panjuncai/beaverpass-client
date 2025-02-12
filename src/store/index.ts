import { combineReducers, configureStore } from "@reduxjs/toolkit";
import {
  persistStore,
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from "redux-persist";
import storage from "redux-persist/lib/storage";
// import { transformToImmutable } from 'redux-persist-transform-immutable';
import authReducer from "./slices/authSlice";
import { categoryApi } from "@/services/categoryApi";

// 定义持久化配置
const persistConfig = {
  key: "root",
  storage, // 如果不希望全部持久化，可以设置 whitelist（只持久化部分 reducer）或 blacklist（排除部分 reducer）
//   whitelist: ["auth"], // 只持久化 auth reducer
  //transforms: [transformToImmutable], // 处理不可变数据（如 Immutable.js）
};

// 合并所有的 reducers
const rootReducer = combineReducers({
  auth: authReducer,
  [categoryApi.reducerPath]: categoryApi.reducer,
});

// 创建持久化的 reducer
const persistedReducer = persistReducer(persistConfig, rootReducer);
export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        // 忽略 redux-persist 相关的 action
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }).concat(categoryApi.middleware),
});

// 创建持久化的 store 对象
export const persistor = persistStore(store);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
