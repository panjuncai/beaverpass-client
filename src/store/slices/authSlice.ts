import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { loginUser, logoutUser, getUser } from '@/services/userService';
import { LoginRequest, User } from '@/types/user';
import { persistor } from '..';

interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
  loading: boolean;
  redirectPath: string | null;
}

const initialState: AuthState = {
  isAuthenticated: false,
  user: null,
  loading: false,
  redirectPath: null,
};

// 异步获取用户信息（比如页面刷新时自动尝试获取登录用户）
export const fetchUser = createAsyncThunk<User, void>(
  'auth/fetchUser',
  async (_, { rejectWithValue }) => {
    try {
      const user: User = await getUser();
      return user;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

// 登录异步 action
export const login = createAsyncThunk<User, LoginRequest>(
  'auth/login',
  async (loginData, { rejectWithValue }) => {
    try {
      const user = await loginUser(loginData);
      return user;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

// 登出异步 action
export const logout = createAsyncThunk<void, void>(
  'auth/logout',
  async (_, { rejectWithValue }) => {
    try {
      await logoutUser();
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setRedirectPath(state, action: PayloadAction<string>) {
      state.redirectPath = action.payload;
    },
    clearRedirectPath(state) {
      state.redirectPath = null;
    },
  },
  extraReducers: (builder) => {
    // fetchUser
    builder.addCase(fetchUser.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(fetchUser.fulfilled, (state, action: PayloadAction<User>) => {
      state.loading = false;
      state.user = action.payload;
      state.isAuthenticated = true;
    });
    builder.addCase(fetchUser.rejected, (state) => {
      state.loading = false;
      state.user = null;
      state.isAuthenticated = false;
    });
    // login
    builder.addCase(login.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(login.fulfilled, (state, action: PayloadAction<User>) => {
      state.loading = false;
      state.user = action.payload;
      state.isAuthenticated = true;
    });
    builder.addCase(login.rejected, (state) => {
      state.loading = false;
    });
    // logout
    builder.addCase(logout.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(logout.fulfilled, (state) => {
      state.loading = false;
      state.user = null;
      state.isAuthenticated = false;
    });
    builder.addCase(logout.rejected, (state) => {
      state.loading = false;
    });
  },
});

export const { setRedirectPath, clearRedirectPath } = authSlice.actions;
export default authSlice.reducer;
