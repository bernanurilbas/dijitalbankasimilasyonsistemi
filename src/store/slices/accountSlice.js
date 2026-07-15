import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../services/api';

// Fetch all accounts belonging to the user
export const fetchAccounts = createAsyncThunk(
  'accounts/fetchAccounts',
  async (userId, { rejectWithValue }) => {
    try {
      const response = await api.get(`/accounts?userId=${userId}`);
      return response.data;
    } catch (err) {
      return rejectWithValue(err);
    }
  }
);

// Fetch transaction history
export const fetchTransactions = createAsyncThunk(
  'accounts/fetchTransactions',
  async (userId, { rejectWithValue }) => {
    try {
      const response = await api.get(`/transactions?userId=${userId}&_sort=date&_order=desc`);
      return response.data;
    } catch (err) {
      return rejectWithValue(err);
    }
  }
);

// Create a new sub-account (e.g. TRY, USD, EUR, GOLD)
export const createSubAccount = createAsyncThunk(
  'accounts/createSubAccount',
  async ({ userId, currency, name }, { rejectWithValue }) => {
    try {
      const accountNoSuffix = String(Math.floor(1000 + Math.random() * 9000));
      const newAccount = {
        userId,
        accountNumber: `1000${accountNoSuffix}`,
        iban: `TR98 0006 2000 0000 1000 1000 ${accountNoSuffix}`,
        balance: 0.00,
        currency,
        name: name || `${currency} Birikim Hesabı`,
        createdAt: new Date().toISOString()
      };
      
      const response = await api.post('/accounts', newAccount);
      return response.data;
    } catch (err) {
      return rejectWithValue(err);
    }
  }
);

// Delete a sub-account
export const deleteAccount = createAsyncThunk(
  'accounts/deleteAccount',
  async ({ userId, accountId, name, iban }, { dispatch, rejectWithValue }) => {
    try {
      await api.delete(`/accounts/${accountId}`);
      
      // Add system log
      await api.post('/systemLogs', {
        message: `${name} (${iban}) hesabı kapatıldı.`,
        userId,
        userRole: 'customer',
        date: new Date().toISOString()
      });

      // Refresh accounts list
      dispatch(fetchAccounts(userId));
      return accountId;
    } catch (err) {
      return rejectWithValue(err);
    }
  }
);

// Perform Money Transfer (Havale, EFT, FAST)
export const performTransfer = createAsyncThunk(
  'accounts/performTransfer',
  async ({ userId, senderAccountId, recipientIban, recipientName, amount, type, description }, { dispatch, getState, rejectWithValue }) => {
    try {
      const numericAmount = parseFloat(amount);
      const accounts = getState().accounts.accounts;
      const senderAccount = accounts.find(a => a.id === senderAccountId);

      if (!senderAccount) {
        return rejectWithValue('Gönderici hesap bulunamadı.');
      }
      if (senderAccount.balance < numericAmount) {
        return rejectWithValue('Yetersiz bakiye.');
      }

      // 1. Deduct sender balance
      const newSenderBalance = parseFloat((senderAccount.balance - numericAmount).toFixed(2));
      await api.patch(`/accounts/${senderAccountId}`, { balance: newSenderBalance });

      // 2. Check if recipient IBAN belongs to our bank (mock search)
      let isInternal = false;
      let recipientAccount = null;

      const recipientResponse = await api.get(`/accounts?iban=${recipientIban.trim()}`);
      if (recipientResponse.data.length > 0) {
        recipientAccount = recipientResponse.data[0];
        isInternal = true;
      }

      // If internal (Havale), update recipient balance
      if (isInternal && recipientAccount) {
        const newRecipientBalance = parseFloat((recipientAccount.balance + numericAmount).toFixed(2));
        await api.patch(`/accounts/${recipientAccount.id}`, { balance: newRecipientBalance });
      }

      // 3. Log the sender's transaction
      const senderTx = {
        userId,
        accountId: senderAccountId,
        type: type.toLowerCase(), // 'transfer', 'eft', 'fast'
        amount: -numericAmount,
        currency: senderAccount.currency,
        senderIban: senderAccount.iban,
        recipientIban,
        recipientName,
        description,
        date: new Date().toISOString(),
        referenceNumber: `REF${Math.floor(100000 + Math.random() * 900000)}`
      };
      await api.post('/transactions', senderTx);

      // 4. If internal, log the recipient's transaction as well
      if (isInternal && recipientAccount) {
        const recipientTx = {
          userId: recipientAccount.userId,
          accountId: recipientAccount.id,
          type: 'deposit',
          amount: numericAmount,
          currency: recipientAccount.currency,
          senderIban: senderAccount.iban,
          recipientIban: recipientAccount.iban,
          recipientName: senderAccount.cardHolder || 'Astra Bank Müşterisi',
          description: `${description} (Gelen Transfer)`,
          date: new Date().toISOString(),
          referenceNumber: senderTx.referenceNumber
        };
        await api.post('/transactions', recipientTx);
      }

      // Add system logs
      await api.post('/systemLogs', {
        message: `${senderAccount.iban} nolu hesaptan ${recipientIban} nolu hesaba ${numericAmount} ${senderAccount.currency} transfer edildi (${type.toUpperCase()}).`,
        userId,
        userRole: 'customer',
        date: new Date().toISOString()
      });

      // Refresh accounts list
      dispatch(fetchAccounts(userId));
      return true;
    } catch (err) {
      return rejectWithValue(err);
    }
  }
);

// Pay Bill
export const payBill = createAsyncThunk(
  'accounts/payBill',
  async ({ userId, accountId, billId, amount, provider }, { dispatch, getState, rejectWithValue }) => {
    try {
      const numericAmount = parseFloat(amount);
      const accounts = getState().accounts.accounts;
      const account = accounts.find(a => a.id === accountId);

      if (!account) {
        return rejectWithValue('Ödeme yapacak hesap bulunamadı.');
      }
      if (account.balance < numericAmount) {
        return rejectWithValue('Yetersiz bakiye.');
      }

      // 1. Deduct account balance
      const newBalance = parseFloat((account.balance - numericAmount).toFixed(2));
      await api.patch(`/accounts/${accountId}`, { balance: newBalance });

      // 2. Mark bill as paid
      await api.patch(`/bills/${billId}`, { isPaid: true });

      // 3. Create transaction record
      const tx = {
        userId,
        accountId,
        type: 'bill',
        amount: -numericAmount,
        currency: 'TRY',
        senderIban: account.iban,
        recipientIban: '-',
        recipientName: provider,
        description: `${provider} Fatura Ödemesi`,
        date: new Date().toISOString(),
        referenceNumber: `REF${Math.floor(100000 + Math.random() * 900000)}`
      };
      await api.post('/transactions', tx);

      // Create system log
      await api.post('/systemLogs', {
        message: `${provider} faturası ${numericAmount} TRY ödenmiştir.`,
        userId,
        userRole: 'customer',
        date: new Date().toISOString()
      });

      // Refresh accounts
      dispatch(fetchAccounts(userId));
      return { billId };
    } catch (err) {
      return rejectWithValue(err);
    }
  }
);

const accountSlice = createSlice({
  name: 'accounts',
  initialState: {
    accounts: [],
    transactions: [],
    loading: false,
    error: null,
    transferSuccess: false,
  },
  reducers: {
    resetTransferSuccess: (state) => {
      state.transferSuccess = false;
    },
    clearAccountError: (state) => {
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // Fetch Accounts
      .addCase(fetchAccounts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAccounts.fulfilled, (state, action) => {
        state.loading = false;
        state.accounts = action.payload;
      })
      .addCase(fetchAccounts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Fetch Transactions
      .addCase(fetchTransactions.fulfilled, (state, action) => {
        state.transactions = action.payload;
      })
      
      // Create Sub Account
      .addCase(createSubAccount.fulfilled, (state, action) => {
        state.accounts.push(action.payload);
      })
      
      // Delete Account
      .addCase(deleteAccount.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteAccount.fulfilled, (state, action) => {
        state.loading = false;
        state.accounts = state.accounts.filter(acc => acc.id !== action.payload);
      })
      .addCase(deleteAccount.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Perform Transfer
      .addCase(performTransfer.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.transferSuccess = false;
      })
      .addCase(performTransfer.fulfilled, (state) => {
        state.loading = false;
        state.transferSuccess = true;
      })
      .addCase(performTransfer.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.transferSuccess = false;
      })
      
      // Pay Bill
      .addCase(payBill.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(payBill.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(payBill.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { resetTransferSuccess, clearAccountError } = accountSlice.actions;
export default accountSlice.reducer;
