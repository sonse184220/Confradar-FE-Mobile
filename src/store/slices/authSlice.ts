import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { AuthState, User } from '../../types/auth';

const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
  accessToken: null,
  refreshToken: null,
  loading: false,
  error: null,

};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setToken: (
      state,
      action: PayloadAction<{ accessToken: string; refreshToken: string }>
    ) => {
      state.accessToken = action.payload.accessToken;
      state.refreshToken = action.payload.refreshToken;
      state.isAuthenticated = true;
    },
    // setToken: (state, action: PayloadAction<string>) => {
    //   state.token = action.payload;
    //   state.isAuthenticated = true;
    // },
    setUser: (state, action: PayloadAction<any>) => {
      state.user = action.payload;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
    clearAuth: (state) => {
      state.user = null;
      state.accessToken = null;
      state.refreshToken = null;
      state.isAuthenticated = false;
      state.loading = false;
      state.error = null;
    },
    // setUser: (state, action: PayloadAction<User>) => {
    //   state.user = action.payload;
    //   state.isAuthenticated = true;
    // },
    // clearAuth: (state) => {
    //   state.user = null;
    //   state.isAuthenticated = false;
    // },
    updateUser: (state, action: PayloadAction<Partial<User>>) => {
      if (state.user) {
        state.user = { ...state.user, ...action.payload };
      }
    },
  },
});

// export const { setUser, clearAuth, updateUser } = authSlice.actions;
export const { setToken, setUser, setLoading, setError, clearAuth } = authSlice.actions;
export default authSlice.reducer;