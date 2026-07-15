import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../services/api';
import { updateProfileSuccess } from './authSlice';

// Update profile details (Name, Email, Phone)
export const updateProfileDetails = createAsyncThunk(
  'profile/updateProfileDetails',
  async ({ userId, data }, { dispatch, rejectWithValue }) => {
    try {
      const response = await api.patch(`/users/${userId}`, data);
      
      // Update system audit log
      await api.post('/systemLogs', {
        message: 'Profil bilgileri güncellendi.',
        userId,
        userRole: 'customer',
        date: new Date().toISOString()
      });

      // Update auth state in real-time
      dispatch(updateProfileSuccess(response.data));
      return response.data;
    } catch (err) {
      return rejectWithValue(err?.response?.data?.message || err.toString());
    }
  }
);

// Update user login password
export const updateUserPassword = createAsyncThunk(
  'profile/updateUserPassword',
  async ({ userId, currentPassword, newPassword }, { rejectWithValue }) => {
    try {
      // 1. Get user details to verify password
      const userResponse = await api.get(`/users/${userId}`);
      const dbUser = userResponse.data;

      if (dbUser.password !== currentPassword) {
        return rejectWithValue('Mevcut şifreniz hatalı.');
      }

      // 2. Patch new password
      await api.patch(`/users/${userId}`, { password: newPassword });

      // Update system audit log
      await api.post('/systemLogs', {
        message: 'Kullanıcı giriş şifresi güncellendi.',
        userId,
        userRole: 'customer',
        date: new Date().toISOString()
      });

      return true;
    } catch (err) {
      return rejectWithValue(err?.response?.data?.message || err.toString());
    }
  }
);

// Update security and notification options (2FA, SMS alerts)
export const updateSecurityPreferences = createAsyncThunk(
  'profile/updateSecurityPreferences',
  async ({ userId, prefs }, { dispatch, rejectWithValue }) => {
    try {
      const response = await api.patch(`/users/${userId}`, prefs);
      
      // Update system audit log
      await api.post('/systemLogs', {
        message: 'Güvenlik ve bildirim tercihleri güncellendi.',
        userId,
        userRole: 'customer',
        date: new Date().toISOString()
      });

      // Sync user state in auth slice
      dispatch(updateProfileSuccess(response.data));
      return response.data;
    } catch (err) {
      return rejectWithValue(err?.response?.data?.message || err.toString());
    }
  }
);

const profileSlice = createSlice({
  name: 'profile',
  initialState: {
    loading: false,
    error: null,
    success: false,
  },
  reducers: {
    resetProfileState(state) {
      state.loading = false;
      state.error = null;
      state.success = false;
    }
  },
  extraReducers: (builder) => {
    builder
      // Details
      .addCase(updateProfileDetails.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(updateProfileDetails.fulfilled, (state) => {
        state.loading = false;
        state.success = true;
      })
      .addCase(updateProfileDetails.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Password
      .addCase(updateUserPassword.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(updateUserPassword.fulfilled, (state) => {
        state.loading = false;
        state.success = true;
      })
      .addCase(updateUserPassword.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Security Prefs
      .addCase(updateSecurityPreferences.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(updateSecurityPreferences.fulfilled, (state) => {
        state.loading = false;
        state.success = true;
      })
      .addCase(updateSecurityPreferences.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  }
});

export const { resetProfileState } = profileSlice.actions;
export default profileSlice.reducer;
