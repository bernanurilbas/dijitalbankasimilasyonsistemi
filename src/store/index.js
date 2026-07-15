import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import accountReducer from './slices/accountSlice';
import cardReducer from './slices/cardSlice';
import investmentReducer from './slices/investmentSlice';
import dashboardReducer from './slices/dashboardSlice';
import transferReducer from './slices/transferSlice';
import transactionReducer from './slices/transactionSlice';
import notificationReducer from './slices/notificationSlice';
import profileReducer from './slices/profileSlice';
import settingsReducer from './slices/settingsSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    accounts: accountReducer,
    cards: cardReducer,
    investments: investmentReducer,
    dashboard: dashboardReducer,
    transfer: transferReducer,
    transaction: transactionReducer,
    notifications: notificationReducer,
    profile: profileReducer,
    settings: settingsReducer,
  },
});

export default store;
