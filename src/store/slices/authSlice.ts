import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { loginUser, logoutUser } from '@/services/authService';
import { LoginRequest, User } from '@/types/user';

interface AuthState {
  isAuthenticated: boolean;
  loginUser: User | null;
  isLoading: boolean;
  redirectPath: string | null;
}

const initialState: AuthState = {
  isAuthenticated: false,
  loginUser: null,
  isLoading: false,
  redirectPath: null,
};

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
    // login
    builder.addCase(login.pending, (state) => {
      state.isLoading = true;
    });
    builder.addCase(login.fulfilled, (state, action: PayloadAction<User>) => {
      state.isLoading = false;
      state.loginUser= action.payload;
      state.isAuthenticated = true;
    });
    builder.addCase(login.rejected, (state) => {
      state.isLoading = false;
    });
    // logout
    builder.addCase(logout.pending, (state) => {
      state.isLoading = true;
    });
    builder.addCase(logout.fulfilled, (state) => {
      state.isLoading = false;
      state.loginUser = null;
      state.isAuthenticated = false;
    });
    builder.addCase(logout.rejected, (state) => {
      state.isLoading = false;
    });
  },
});

export const { setRedirectPath, clearRedirectPath } = authSlice.actions;
export default authSlice.reducer;
