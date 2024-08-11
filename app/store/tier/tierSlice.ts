/* eslint-disable @typescript-eslint/no-explicit-any */
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { createTierAPI } from "@/api/tiers/create-tier";
import { updateTierAPI } from "@/api/tiers/update-tier";
import { deleteTierAPI } from "@/api/tiers/delete-tier";
import { getTierAPI } from "@/api/tiers/get-tier";
import { listTiersAPI } from "@/api/tiers/list-tiers";

// Define initial state for the slice
const initialState = {
  loading: false,
  error: null,
  loyaltyTiers: [], // Assuming this stores the list of loyalty configurations
  selectedLoyaltyTier: null, // Assuming this stores the selected loyalty configuration
};

// Define async thunk for creating loyalty configuration
export const createLoyaltyTier: any = createAsyncThunk(
  "loyaltyTier/create",
  async (loyaltyData: any, thunkAPI) => {
    try {
      const response = await createTierAPI(loyaltyData);
      return response.data;
    } catch (error: any) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  },
);

// Define async thunk for updating loyalty configuration
export const updateLoyaltyTier: any = createAsyncThunk(
  "loyaltyTier/update",
  async (loyaltyData: any, thunkAPI) => {
    try {
      const response = await updateTierAPI(loyaltyData.id, loyaltyData);
      return response.data;
    } catch (error: any) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  },
);

export const deleteLoyaltyTier: any = createAsyncThunk(
  "loyaltyTier/delete",
  async (loyaltyId: any, thunkAPI) => {
    try {
      await deleteTierAPI(loyaltyId);
      return loyaltyId; // Return the deleted loyaltyId
    } catch (error: any) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  },
);

// Define async thunk for fetching a single loyalty configuration by ID
export const getLoyaltyTierById: any = createAsyncThunk(
  "loyaltyTier/getById",
  async (loyaltyId: string, thunkAPI) => {
    try {
      const response: any = getTierAPI(loyaltyId);
      return response;
    } catch (error: any) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  },
);

// Define async thunk for fetching all loyalty configurations
export const getAllLoyaltyTiers: any = createAsyncThunk(
  "loyaltyTier/getAll",
  async (_, thunkAPI) => {
    try {
      console.log("token");
      const response = await listTiersAPI();
      console.log("response", response);
      return response;
    } catch (error: any) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  },
);

// Create the loyalty slice
const loyaltySlice = createSlice({
  name: "loyaltyTier",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    // Handle createLoyaltyTier pending and fulfilled actions
    builder.addCase(createLoyaltyTier.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(createLoyaltyTier.fulfilled, (state) => {
      state.loading = false;
    });
    builder.addCase(createLoyaltyTier.rejected, (state: any, action) => {
      state.loading = false;
      state.error = action.payload;
    });

    // Handle updateLoyaltyTier pending and fulfilled actions
    builder.addCase(updateLoyaltyTier.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(updateLoyaltyTier.fulfilled, (state: any) => {
      state.loading = false;
    });
    builder.addCase(updateLoyaltyTier.rejected, (state: any, action) => {
      state.loading = false;
      state.error = action.payload;
    });

    // Handle deleteLoyaltyTier pending and fulfilled actions
    builder.addCase(deleteLoyaltyTier.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(deleteLoyaltyTier.fulfilled, (state, action) => {
      state.loading = false;
      // Assuming payload is the deleted loyaltyId
      state.loyaltyTiers = state.loyaltyTiers.filter(
        (loyalty: any) => loyalty.id !== action.payload,
      );
    });
    builder.addCase(deleteLoyaltyTier.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    });

    // Handle getLoyaltyTierById pending and fulfilled actions
    builder.addCase(getLoyaltyTierById.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(getLoyaltyTierById.fulfilled, (state, action) => {
      state.loading = false;
      // Assuming payload is the fetched loyalty tier object
      state.selectedLoyaltyTier = action.payload;
    });
    builder.addCase(getLoyaltyTierById.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    });

    // Handle getAllLoyaltyTiers pending and fulfilled actions
    builder.addCase(getAllLoyaltyTiers.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(getAllLoyaltyTiers.fulfilled, (state, action) => {
      state.loading = false;
      // Assuming payload is an array of loyalty tier objects
      state.loyaltyTiers = action.payload;
    });
    builder.addCase(getAllLoyaltyTiers.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    });
  },
});

// Export actions and reducer
// export const {} = loyaltySlice.actions;
export default loyaltySlice.reducer;
