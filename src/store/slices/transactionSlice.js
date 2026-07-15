import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../services/api';

export const fetchTransactionsHistory = createAsyncThunk(
  'transaction/fetchTransactionsHistory',
  async (userId, { rejectWithValue }) => {
    try {
      const response = await api.get(`/transactions?userId=${userId}&_sort=date&_order=desc`);
      return response.data;
    } catch (err) {
      return rejectWithValue(err?.response?.data?.message || err.toString());
    }
  }
);

const initialState = {
  transactions: [],
  filters: {
    search: '',
    type: 'ALL',
    currency: 'ALL',
    dateRange: 'ALL', // ALL, WEEK, MONTH
  },
  pagination: {
    currentPage: 1,
    itemsPerPage: 6,
  },
  selectedTransaction: null,
  loading: false,
  error: null,
};

const transactionSlice = createSlice({
  name: 'transaction',
  initialState,
  reducers: {
    setSearchFilter(state, action) {
      state.filters.search = action.payload;
      state.pagination.currentPage = 1; // Reset page on filter
    },
    setTypeFilter(state, action) {
      state.filters.type = action.payload;
      state.pagination.currentPage = 1;
    },
    setCurrencyFilter(state, action) {
      state.filters.currency = action.payload;
      state.pagination.currentPage = 1;
    },
    setDateRangeFilter(state, action) {
      state.filters.dateRange = action.payload;
      state.pagination.currentPage = 1;
    },
    setCurrentPage(state, action) {
      state.pagination.currentPage = action.payload;
    },
    setSelectedTransaction(state, action) {
      state.selectedTransaction = action.payload;
    },
    resetFilters(state) {
      state.filters = initialState.filters;
      state.pagination.currentPage = 1;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchTransactionsHistory.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTransactionsHistory.fulfilled, (state, action) => {
        state.loading = false;
        state.transactions = action.payload;
      })
      .addCase(fetchTransactionsHistory.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  }
});

export const {
  setSearchFilter,
  setTypeFilter,
  setCurrencyFilter,
  setDateRangeFilter,
  setCurrentPage,
  setSelectedTransaction,
  resetFilters
} = transactionSlice.actions;

export default transactionSlice.reducer;
