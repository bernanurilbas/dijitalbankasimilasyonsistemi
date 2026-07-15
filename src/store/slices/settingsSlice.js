import { createSlice } from '@reduxjs/toolkit';

const savedTheme = localStorage.getItem('astra_theme') || 'light';
const savedLanguage = localStorage.getItem('astra_lang') || 'tr';

// Apply theme class immediately on startup
if (savedTheme === 'dark') {
  document.documentElement.classList.add('dark');
} else {
  document.documentElement.classList.remove('dark');
}

const initialState = {
  theme: savedTheme,
  language: savedLanguage,
  notifications: {
    marketing: localStorage.getItem('astra_marketing') !== 'false',
    transactionSms: localStorage.getItem('astra_tx_sms') !== 'false',
    securityEmail: localStorage.getItem('astra_sec_email') !== 'false',
  },
  security: {
    autoLogoutMinutes: parseInt(localStorage.getItem('astra_logout') || '15'),
    rememberDevice: localStorage.getItem('astra_rem_dev') !== 'false',
  }
};

const settingsSlice = createSlice({
  name: 'settings',
  initialState,
  reducers: {
    setTheme(state, action) {
      const nextTheme = action.payload;
      state.theme = nextTheme;
      localStorage.setItem('astra_theme', nextTheme);
      if (nextTheme === 'dark') {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    },
    setLanguage(state, action) {
      state.language = action.payload;
      localStorage.setItem('astra_lang', action.payload);
    },
    updateNotificationSettings(state, action) {
      state.notifications = { ...state.notifications, ...action.payload };
      localStorage.setItem('astra_marketing', String(state.notifications.marketing));
      localStorage.setItem('astra_tx_sms', String(state.notifications.transactionSms));
      localStorage.setItem('astra_sec_email', String(state.notifications.securityEmail));
    },
    updateSecuritySettings(state, action) {
      state.security = { ...state.security, ...action.payload };
      localStorage.setItem('astra_logout', String(state.security.autoLogoutMinutes));
      localStorage.setItem('astra_rem_dev', String(state.security.rememberDevice));
    }
  }
});

export const { 
  setTheme, 
  setLanguage, 
  updateNotificationSettings, 
  updateSecuritySettings 
} = settingsSlice.actions;

export default settingsSlice.reducer;
