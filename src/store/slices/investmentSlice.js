import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../services/api';
import { fetchAccounts, fetchTransactions } from './accountSlice';

// Fetch Live exchange/gold rates
export const fetchRates = createAsyncThunk(
  'investments/fetchRates',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get('/rates');
      return response.data;
    } catch (err) {
      return rejectWithValue(err);
    }
  }
);

// Fetch User's Investment transactions
export const fetchInvestments = createAsyncThunk(
  'investments/fetchInvestments',
  async (userId, { rejectWithValue }) => {
    try {
      const response = await api.get(`/investments?userId=${userId}`);
      return response.data;
    } catch (err) {
      return rejectWithValue(err);
    }
  }
);

// Buy Investment Asset (TRY -> Asset)
export const buyAsset = createAsyncThunk(
  'investments/buyAsset',
  async ({ userId, tryAccountId, targetAccountId, assetType, amount, rate }, { dispatch, getState, rejectWithValue }) => {
    try {
      const accounts = getState().accounts.accounts;
      const tryAccount = accounts.find(a => a.id === tryAccountId);
      const targetAccount = accounts.find(a => a.id === targetAccountId);
      
      const qty = parseFloat(amount); // Amount of asset to buy (e.g. $100 or 5g Gold)
      const unitRate = parseFloat(rate);
      const totalCost = parseFloat((qty * unitRate).toFixed(2));

      if (!tryAccount) return rejectWithValue('TL hesabı bulunamadı.');
      if (!targetAccount) return rejectWithValue('Yatırım hesabı bulunamadı.');
      if (tryAccount.balance < totalCost) return rejectWithValue('TL hesabınızda yetersiz bakiye.');

      // 1. Deduct TRY balance
      const newTryBalance = parseFloat((tryAccount.balance - totalCost).toFixed(2));
      await api.patch(`/accounts/${tryAccountId}`, { balance: newTryBalance });

      // 2. Add target asset balance
      const newTargetBalance = parseFloat((targetAccount.balance + qty).toFixed(2));
      await api.patch(`/accounts/${targetAccountId}`, { balance: newTargetBalance });

      // 3. Create investment list record (if exists update, else create)
      const investmentsResponse = await api.get(`/investments?userId=${userId}&assetType=${assetType}`);
      if (investmentsResponse.data.length > 0) {
        const inv = investmentsResponse.data[0];
        const newQty = parseFloat((inv.amount + qty).toFixed(2));
        // Average buy price calculation
        const newBuyPrice = parseFloat(((inv.amount * inv.buyPrice + totalCost) / newQty).toFixed(2));
        await api.patch(`/investments/${inv.id}`, { amount: newQty, buyPrice: newBuyPrice, date: new Date().toISOString() });
      } else {
        await api.post('/investments', {
          userId,
          assetType,
          amount: qty,
          buyPrice: unitRate,
          date: new Date().toISOString()
        });
      }

      // 4. Log transactions
      // TL Out
      await api.post('/transactions', {
        userId,
        accountId: tryAccountId,
        type: 'investment',
        amount: -totalCost,
        currency: 'TRY',
        senderIban: tryAccount.iban,
        recipientIban: targetAccount.iban,
        recipientName: `Yatırım Alımı (${assetType})`,
        description: `${qty} ${assetType} Alımı (Kur: ${unitRate})`,
        date: new Date().toISOString(),
        referenceNumber: `INV${Math.floor(100000 + Math.random() * 900000)}`
      });

      // Asset In
      await api.post('/transactions', {
        userId,
        accountId: targetAccountId,
        type: 'deposit',
        amount: qty,
        currency: assetType,
        senderIban: tryAccount.iban,
        recipientIban: targetAccount.iban,
        recipientName: tryAccount.name,
        description: `TL Hesabından Gelen Alım`,
        date: new Date().toISOString(),
        referenceNumber: `INV${Math.floor(100000 + Math.random() * 900000)}`
      });

      // Log system
      await api.post('/systemLogs', {
        message: `${qty} ${assetType} alımı gerçekleştirildi. Toplam Maliyet: ${totalCost} TRY.`,
        userId,
        userRole: 'customer',
        date: new Date().toISOString()
      });

      // Refresh data
      dispatch(fetchAccounts(userId));
      dispatch(fetchInvestments(userId));
      dispatch(fetchTransactions(userId));
      return true;
    } catch (err) {
      return rejectWithValue(err);
    }
  }
);

// Sell Investment Asset (Asset -> TRY)
export const sellAsset = createAsyncThunk(
  'investments/sellAsset',
  async ({ userId, tryAccountId, targetAccountId, assetType, amount, rate }, { dispatch, getState, rejectWithValue }) => {
    try {
      const accounts = getState().accounts.accounts;
      const tryAccount = accounts.find(a => a.id === tryAccountId);
      const targetAccount = accounts.find(a => a.id === targetAccountId);
      
      const qty = parseFloat(amount); // Amount of asset to sell
      const unitRate = parseFloat(rate);
      const totalEarnings = parseFloat((qty * unitRate).toFixed(2));

      if (!tryAccount) return rejectWithValue('TL hesabı bulunamadı.');
      if (!targetAccount) return rejectWithValue('Yatırım hesabı bulunamadı.');
      if (targetAccount.balance < qty) return rejectWithValue(`Hesabınızda yeterli miktarda ${assetType} bulunamadı.`);

      // 1. Deduct target asset balance
      const newTargetBalance = parseFloat((targetAccount.balance - qty).toFixed(2));
      await api.patch(`/accounts/${targetAccountId}`, { balance: newTargetBalance });

      // 2. Add TRY balance
      const newTryBalance = parseFloat((tryAccount.balance + totalEarnings).toFixed(2));
      await api.patch(`/accounts/${tryAccountId}`, { balance: newTryBalance });

      // 3. Update investment list record
      const investmentsResponse = await api.get(`/investments?userId=${userId}&assetType=${assetType}`);
      if (investmentsResponse.data.length > 0) {
        const inv = investmentsResponse.data[0];
        const newQty = parseFloat((inv.amount - qty).toFixed(2));
        if (newQty <= 0) {
          await api.delete(`/investments/${inv.id}`);
        } else {
          await api.patch(`/investments/${inv.id}`, { amount: newQty, date: new Date().toISOString() });
        }
      }

      // 4. Log transactions
      // Asset Out
      await api.post('/transactions', {
        userId,
        accountId: targetAccountId,
        type: 'investment',
        amount: -qty,
        currency: assetType,
        senderIban: targetAccount.iban,
        recipientIban: tryAccount.iban,
        recipientName: `Yatırım Satımı (${assetType})`,
        description: `${qty} ${assetType} Satışı (Kur: ${unitRate})`,
        date: new Date().toISOString(),
        referenceNumber: `INV${Math.floor(100000 + Math.random() * 900000)}`
      });

      // TL In
      await api.post('/transactions', {
        userId,
        accountId: tryAccountId,
        type: 'deposit',
        amount: totalEarnings,
        currency: 'TRY',
        senderIban: targetAccount.iban,
        recipientIban: tryAccount.iban,
        recipientName: targetAccount.name,
        description: `${assetType} Satışından Gelen Tutar`,
        date: new Date().toISOString(),
        referenceNumber: `INV${Math.floor(100000 + Math.random() * 900000)}`
      });

      // Log system
      await api.post('/systemLogs', {
        message: `${qty} ${assetType} satışı gerçekleştirildi. Toplam Kazanç: ${totalEarnings} TRY.`,
        userId,
        userRole: 'customer',
        date: new Date().toISOString()
      });

      // Refresh data
      dispatch(fetchAccounts(userId));
      dispatch(fetchInvestments(userId));
      dispatch(fetchTransactions(userId));
      return true;
    } catch (err) {
      return rejectWithValue(err);
    }
  }
);

const investmentSlice = createSlice({
  name: 'investments',
  initialState: {
    rates: [],
    portfolio: [],
    loading: false,
    error: null,
  },
  reducers: {
    clearInvestmentError: (state) => {
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // Fetch Rates
      .addCase(fetchRates.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchRates.fulfilled, (state, action) => {
        state.loading = false;
        state.rates = action.payload;
      })
      .addCase(fetchRates.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Fetch Portfolio
      .addCase(fetchInvestments.fulfilled, (state, action) => {
        state.portfolio = action.payload;
      })
      
      // Buy & Sell Slices (standard loading)
      .addCase(buyAsset.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(buyAsset.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(buyAsset.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      .addCase(sellAsset.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(sellAsset.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(sellAsset.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearInvestmentError } = investmentSlice.actions;
export default investmentSlice.reducer;
