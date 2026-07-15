import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  stats: {
    totalBalance: 5000,
    monthlyIncome: 8500,
    monthlyExpense: 3200,
    incomeChange: 12.5,
    expenseChange: -4.8,
  },
  charts: {
    income: [4200, 5100, 4800, 6200, 7500, 8500],
    expense: [1800, 2100, 1950, 2400, 3100, 3200],
    months: ['Oca', 'Şub', 'Mar', 'Nis', 'May', 'Haz'],
  },
  notifications: [
    { id: 1, text: 'Vadesiz TL hesabınıza 5.000 TL hoş geldin bakiyesi tanımlandı.', time: 'Bugün', read: false },
    { id: 2, text: 'Astra Debit banka kartınız aktif hale getirildi.', time: 'Dün', read: false },
    { id: 3, text: 'Güvenli giriş şifreniz başarıyla güncellendi.', time: '2 gün önce', read: true },
  ],
  loading: false,
  error: null,
};

const dashboardSlice = createSlice({
  name: 'dashboard',
  initialState,
  reducers: {
    markAllNotificationsRead(state) {
      state.notifications.forEach(n => { n.read = true; });
    },
    markNotificationRead(state, action) {
      const n = state.notifications.find(item => item.id === action.payload);
      if (n) n.read = true;
    },
    addNotification(state, action) {
      state.notifications.unshift({
        id: Date.now(),
        text: action.payload.text,
        time: 'Şimdi',
        read: false
      });
    }
  }
});

export const { 
  markAllNotificationsRead, 
  markNotificationRead, 
  addNotification 
} = dashboardSlice.actions;

export default dashboardSlice.reducer;
