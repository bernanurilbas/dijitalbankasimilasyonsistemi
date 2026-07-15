import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../services/api';
import { fetchAccounts, fetchTransactions } from './accountSlice';

export const sendTransfer = createAsyncThunk(
  'transfer/sendTransfer',
  async ({ userId, senderAccountId, recipientIban, recipientName, amount, type, description }, { dispatch, getState, rejectWithValue }) => {
    try {
      const numericAmount = parseFloat(amount);
      const accounts = getState().accounts.accounts;
      const senderAccount = accounts.find(a => a.id === senderAccountId);

      if (!senderAccount) return rejectWithValue('Gönderici hesap bulunamadı.');
      if (senderAccount.balance < numericAmount) return rejectWithValue('Yetersiz bakiye.');

      // 1. Deduct sender balance
      const newSenderBalance = parseFloat((senderAccount.balance - numericAmount).toFixed(2));
      await api.patch(`/accounts/${senderAccountId}`, { balance: newSenderBalance });

      // 2. Check if internal
      let isInternal = false;
      let recipientAccount = null;
      const recipientResponse = await api.get(`/accounts?iban=${recipientIban.trim()}`);
      if (recipientResponse.data.length > 0) {
        recipientAccount = recipientResponse.data[0];
        isInternal = true;
      }

      // If internal, update recipient balance
      if (isInternal && recipientAccount) {
        const newRecipientBalance = parseFloat((recipientAccount.balance + numericAmount).toFixed(2));
        await api.patch(`/accounts/${recipientAccount.id}`, { balance: newRecipientBalance });
      }

      const referenceNumber = `REF${Math.floor(100000 + Math.random() * 900000)}`;

      // 3. Log sender transaction
      const senderTx = {
        userId,
        accountId: senderAccountId,
        type: isInternal ? 'outgoing' : type.toLowerCase(), // 'transfer', 'eft', 'fast'
        amount: -numericAmount,
        currency: senderAccount.currency,
        senderIban: senderAccount.iban,
        recipientIban,
        recipientName,
        description,
        date: new Date().toISOString(),
        referenceNumber
      };
      await api.post('/transactions', senderTx);

      // 4. Log recipient transaction (if internal)
      if (isInternal && recipientAccount) {
        const recipientTx = {
          userId: recipientAccount.userId,
          accountId: recipientAccount.id,
          type: 'incoming',
          amount: numericAmount,
          currency: recipientAccount.currency,
          senderIban: senderAccount.iban,
          recipientIban: recipientAccount.iban,
          recipientName: senderAccount.cardHolder || 'Astra Bank Müşterisi',
          description: `${description} (Gelen Transfer)`,
          date: new Date().toISOString(),
          referenceNumber
        };
        await api.post('/transactions', recipientTx);
      }

      // Log system audit log
      await api.post('/systemLogs', {
        message: `${senderAccount.iban} nolu hesaptan ${recipientIban} nolu hesaba ${numericAmount} ${senderAccount.currency} transfer edildi (${type.toUpperCase()}).`,
        userId,
        userRole: 'customer',
        date: new Date().toISOString()
      });

      // Refresh accounts and transactions
      dispatch(fetchAccounts(userId));
      dispatch(fetchTransactions(userId));

      return {
        referenceNumber,
        date: senderTx.date,
        senderIban: senderAccount.iban,
        recipientIban,
        recipientName,
        amount: numericAmount,
        currency: senderAccount.currency,
        description,
        type: type.toUpperCase()
      };
    } catch (err) {
      return rejectWithValue(err?.response?.data?.message || err.toString());
    }
  }
);

const transferSlice = createSlice({
  name: 'transfer',
  initialState: {
    loading: false,
    error: null,
    successData: null,
  },
  reducers: {
    resetTransferState(state) {
      state.loading = false;
      state.error = null;
      state.successData = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(sendTransfer.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.successData = null;
      })
      .addCase(sendTransfer.fulfilled, (state, action) => {
        state.loading = false;
        state.successData = action.payload;
      })
      .addCase(sendTransfer.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  }
});

export const { resetTransferState } = transferSlice.actions;
export default transferSlice.reducer;
