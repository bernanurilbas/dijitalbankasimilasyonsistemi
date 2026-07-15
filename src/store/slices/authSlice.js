import { createSlice } from '@reduxjs/toolkit';

// Ensure the application always opens with the login page first on launch
if (typeof window !== 'undefined' && !sessionStorage.getItem('astra_session_active')) {
  localStorage.removeItem('astra_token');
  localStorage.removeItem('astra_user');
  sessionStorage.setItem('astra_session_active', 'true');
}

const token = localStorage.getItem('astra_token');
const userJson = localStorage.getItem('astra_user');
let parsedUser = null;

if (userJson) {
  try {
    parsedUser = JSON.parse(userJson);
    if (parsedUser && parsedUser.fullName) {
      parsedUser.fullName = parsedUser.fullName.replace(/^Banka Görevlisi\s+/i, '');
    }
  } catch (e) {
    localStorage.removeItem('astra_user');
  }
}

const initialState = {
  user: parsedUser,
  token: token,
  isAuthenticated: !!token && !!parsedUser,
  loading: false,
  error: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    authStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    loginSuccess: (state, action) => {
      state.loading = false;
      state.isAuthenticated = true;
      let user = { ...action.payload.user };
      if (user && user.fullName) {
        user.fullName = user.fullName.replace(/^Banka Görevlisi\s+/i, '');
      }
      state.user = user;
      state.token = action.payload.token;
      state.error = null;
      localStorage.setItem('astra_token', action.payload.token);
      localStorage.setItem('astra_user', JSON.stringify(user));
    },
    authFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      state.loading = false;
      state.error = null;
      localStorage.removeItem('astra_token');
      localStorage.removeItem('astra_user');
    },
    updateProfileSuccess: (state, action) => {
      state.user = { ...state.user, ...action.payload };
      localStorage.setItem('astra_user', JSON.stringify(state.user));
    },
    clearError: (state) => {
      state.error = null;
    }
  },
});

export const { authStart, loginSuccess, authFailure, logout, updateProfileSuccess, clearError } = authSlice.actions;
export default authSlice.reducer;
