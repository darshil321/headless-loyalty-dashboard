/* eslint-disable @typescript-eslint/no-explicit-any */
import { getTransactionAPI } from "@/api/transaction/get-transaction";
import { listTransactionsAPI } from "@/api/transaction/list-transactions";
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
// Define initial state for the slice
const initialState = {
  loading: false,
  error: null,
  loyaltyTransaction: [], // Assuming this stores the list of loyalty configurations
  selectedLoyaltyTransaction: null, // Assuming this stores the selected loyalty configuration
};

// Define async thunk for fetching a single loyalty configuration by ID
export const getLoyaltyTransactionByUserId: any = createAsyncThunk(
  "loyaltyTransaction/getById",
  async (loyaltyId: any, thunkAPI) => {
    try {
      const response = await getTransactionAPI(loyaltyId);
      return response;
    } catch (error: any) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  },
);

// Define async thunk for fetching all loyalty configurations
export const getAllLoyaltyTransaction: any = createAsyncThunk(
  "loyaltyTransaction/getAll",
  async (userId, thunkAPI) => {
    try {
      const response = await listTransactionsAPI();
      return response;
    } catch (error: any) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  },
);

// Create the loyalty slice
const loyaltySlice = createSlice({
  name: "loyaltyTransaction",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    // Handle getLoyaltyTransactionById pending and fulfilled actions
    builder.addCase(getLoyaltyTransactionByUserId.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(
      getLoyaltyTransactionByUserId.fulfilled,
      (state, action) => {
        state.loading = false;
        // Assuming payload is the fetched loyalty transaction object
        state.selectedLoyaltyTransaction = action.payload;
      },
    );
    builder.addCase(getLoyaltyTransactionByUserId.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    });

    // Handle getAllLoyaltyTransaction pending and fulfilled actions
    builder.addCase(getAllLoyaltyTransaction.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(getAllLoyaltyTransaction.fulfilled, (state, action) => {
      state.loading = false;
      // Assuming payload is an array of loyalty transaction objects
      state.loyaltyTransaction = action.payload;
    });
    builder.addCase(getAllLoyaltyTransaction.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    });
  },
});

// Export actions and reducer
// export const {} = loyaltySlice.actions;
export default loyaltySlice.reducer;
