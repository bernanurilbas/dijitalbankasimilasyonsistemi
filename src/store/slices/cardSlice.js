import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../services/api';

// Fetch all cards for user
export const fetchCards = createAsyncThunk(
  'cards/fetchCards',
  async (userId, { rejectWithValue }) => {
    try {
      const response = await api.get(`/cards?userId=${userId}`);
      return response.data;
    } catch (err) {
      return rejectWithValue(err);
    }
  }
);

// Toggle Card Freeze Status (Freeze/Unfreeze)
export const toggleFreezeCard = createAsyncThunk(
  'cards/toggleFreezeCard',
  async ({ cardId, isFrozen }, { rejectWithValue }) => {
    try {
      const response = await api.patch(`/cards/${cardId}`, { isFrozen: !isFrozen });
      return response.data;
    } catch (err) {
      return rejectWithValue(err);
    }
  }
);

// Update Card Limit
export const updateCardLimit = createAsyncThunk(
  'cards/updateCardLimit',
  async ({ cardId, newLimit }, { rejectWithValue }) => {
    try {
      const response = await api.patch(`/cards/${cardId}`, { limit: parseFloat(newLimit) });
      return response.data;
    } catch (err) {
      return rejectWithValue(err);
    }
  }
);

// Create a new Virtual Card
export const createVirtualCard = createAsyncThunk(
  'cards/createVirtualCard',
  async ({ userId, accountId, name, limit }, { rejectWithValue }) => {
    try {
      const userResponse = await api.get(`/users/${userId}`);
      const fullName = userResponse.data.fullName || 'DEĞERLİ MÜŞTERİMİZ';

      // Generate random virtual card details
      const cardNo = `4505 2118 ${Math.floor(1000 + Math.random() * 9000)} ${Math.floor(1000 + Math.random() * 9000)}`;
      const cvv = String(Math.floor(100 + Math.random() * 900));
      
      const newCard = {
        userId,
        accountId,
        cardHolder: fullName.toUpperCase(),
        cardNumber: cardNo,
        expiryDate: '12/30',
        cvv,
        type: 'virtual',
        limit: parseFloat(limit),
        usedLimit: 0,
        isFrozen: false,
        name: name || 'Sanal Kart'
      };

      const response = await api.post('/cards', newCard);
      
      // Log this action
      await api.post('/systemLogs', {
        message: `${name || 'Sanal Kart'} (${cardNo}) başarıyla oluşturuldu.`,
        userId,
        userRole: 'customer',
        date: new Date().toISOString()
      });

      return response.data;
    } catch (err) {
      return rejectWithValue(err);
    }
  }
);

const cardSlice = createSlice({
  name: 'cards',
  initialState: {
    cards: [],
    loading: false,
    error: null,
  },
  reducers: {
    clearCardError: (state) => {
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // Fetch Cards
      .addCase(fetchCards.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCards.fulfilled, (state, action) => {
        state.loading = false;
        state.cards = action.payload;
      })
      .addCase(fetchCards.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Toggle Freeze
      .addCase(toggleFreezeCard.fulfilled, (state, action) => {
        const index = state.cards.findIndex(c => c.id === action.payload.id);
        if (index !== -1) {
          state.cards[index] = action.payload;
        }
      })
      
      // Update Limit
      .addCase(updateCardLimit.fulfilled, (state, action) => {
        const index = state.cards.findIndex(c => c.id === action.payload.id);
        if (index !== -1) {
          state.cards[index] = action.payload;
        }
      })
      
      // Create Virtual Card
      .addCase(createVirtualCard.pending, (state) => {
        state.loading = true;
      })
      .addCase(createVirtualCard.fulfilled, (state, action) => {
        state.loading = false;
        state.cards.push(action.payload);
      })
      .addCase(createVirtualCard.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearCardError } = cardSlice.actions;
export default cardSlice.reducer;
