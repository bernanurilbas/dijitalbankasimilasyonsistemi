import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../services/api';

// Fetch all notifications for user
export const fetchNotifications = createAsyncThunk(
  'notifications/fetchNotifications',
  async (userId, { rejectWithValue }) => {
    try {
      const response = await api.get(`/notifications?userId=${userId}&_sort=date&_order=desc`);
      return response.data;
    } catch (err) {
      return rejectWithValue(err?.response?.data?.message || err.toString());
    }
  }
);

// Mark a single notification as read
export const markNotificationAsRead = createAsyncThunk(
  'notifications/markNotificationAsRead',
  async (notificationId, { rejectWithValue }) => {
    try {
      const response = await api.patch(`/notifications/${notificationId}`, { isRead: true });
      return response.data;
    } catch (err) {
      return rejectWithValue(err?.response?.data?.message || err.toString());
    }
  }
);

// Mark all unread notifications as read
export const markAllNotificationsAsRead = createAsyncThunk(
  'notifications/markAllNotificationsAsRead',
  async (userId, { dispatch, getState, rejectWithValue }) => {
    try {
      const { notifications } = getState().notifications;
      const unread = notifications.filter(n => !n.isRead);

      // Perform patch requests concurrently
      const promises = unread.map(n => api.patch(`/notifications/${n.id}`, { isRead: true }));
      await Promise.all(promises);

      // Refresh list
      dispatch(fetchNotifications(userId));
      return true;
    } catch (err) {
      return rejectWithValue(err?.response?.data?.message || err.toString());
    }
  }
);

// Delete notification
export const deleteNotification = createAsyncThunk(
  'notifications/deleteNotification',
  async (notificationId, { rejectWithValue }) => {
    try {
      await api.delete(`/notifications/${notificationId}`);
      return notificationId;
    } catch (err) {
      return rejectWithValue(err?.response?.data?.message || err.toString());
    }
  }
);

const notificationSlice = createSlice({
  name: 'notifications',
  initialState: {
    notifications: [],
    unreadCount: 0,
    loading: false,
    error: null,
  },
  reducers: {
    addLocalNotification(state, action) {
      state.notifications.unshift(action.payload);
      state.unreadCount += 1;
    }
  },
  extraReducers: (builder) => {
    builder
      // Fetch Notifications
      .addCase(fetchNotifications.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchNotifications.fulfilled, (state, action) => {
        state.loading = false;
        state.notifications = action.payload;
        state.unreadCount = action.payload.filter(n => !n.isRead).length;
      })
      .addCase(fetchNotifications.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Mark As Read
      .addCase(markNotificationAsRead.fulfilled, (state, action) => {
        const index = state.notifications.findIndex(n => n.id === action.payload.id);
        if (index !== -1) {
          state.notifications[index] = action.payload;
          state.unreadCount = state.notifications.filter(n => !n.isRead).length;
        }
      })

      // Delete Notification
      .addCase(deleteNotification.fulfilled, (state, action) => {
        state.notifications = state.notifications.filter(n => n.id !== action.payload);
        state.unreadCount = state.notifications.filter(n => !n.isRead).length;
      });
  }
});

export const { addLocalNotification } = notificationSlice.actions;
export default notificationSlice.reducer;
