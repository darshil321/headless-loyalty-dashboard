/* eslint-disable @typescript-eslint/no-explicit-any */
import { getConfigAPI } from "@/api/config/get-config";
import { listConfigsAPI } from "@/api/config/list-configs";
import { updateConfigAPI } from "@/api/config/update-config";
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
// import { fetchWithAuth } from "../../utils/fetchAuthApis";

// Define initial state for the slice
const initialState = {
  loading: false,
  error: null,
  loyaltyConfigs: [], // Assuming this stores the list of loyalty configurations
  selectedLoyaltyConfig: null, // Assuming this stores the selected loyalty configuration
};

// Define async thunk for creating loyalty configuration
export const createLoyaltyConfig: any = createAsyncThunk(
  "loyaltyConfig/create",
  async (loyaltyData: any, thunkAPI) => {
    try {
      // const response = await fetchWithAuth(
      //   "/loyalty_config",
      //   "POST",
      //   loyaltyData,
      // );
      // return response.data;
    } catch (error: any) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  },
);

// Define async thunk for updating loyalty configuration
export const updateLoyaltyConfig: any = createAsyncThunk(
  "loyaltyConfig/update",
  async (loyaltyData: any, thunkAPI) => {
    try {
      const response = await updateConfigAPI(loyaltyData.id, loyaltyData);
      return response.data;
    } catch (error: any) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  },
);

export const deleteLoyaltyConfig: any = createAsyncThunk(
  "loyaltyConfig/delete",
  async (loyaltyId, thunkAPI) => {
    try {
      // await fetchWithAuth(`/loyalty_config/${loyaltyId}`, "DELETE");
      // return loyaltyId; // Return the deleted loyaltyId
    } catch (error: any) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  },
);

// Define async thunk for fetching a single loyalty configuration by ID
export const getLoyaltyConfigById: any = createAsyncThunk(
  "loyaltyConfig/getById",
  async (loyaltyId: string, thunkAPI) => {
    try {
      const response = await getConfigAPI(loyaltyId);
      return response;
    } catch (error: any) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  },
);

// Define async thunk for fetching all loyalty configurations
export const getAllLoyaltyConfigs: any = createAsyncThunk(
  "loyaltyConfig/getAll",
  async (_, thunkAPI) => {
    try {
      const response = await listConfigsAPI();
      return response;
    } catch (error: any) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  },
);

// Create the loyalty slice
const loyaltySlice = createSlice({
  name: "loyaltyConfig",
  initialState,
  reducers: {
    clearLoyaltyConfig: (state) => {
      state.selectedLoyaltyConfig = null;
    },
  },
  extraReducers: (builder) => {
    // Handle createLoyaltyConfig pending and fulfilled actions
    builder.addCase(createLoyaltyConfig.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(createLoyaltyConfig.fulfilled, (state) => {
      state.loading = false;
    });
    builder.addCase(createLoyaltyConfig.rejected, (state: any, action) => {
      state.loading = false;
      state.error = action.payload;
    });

    // Handle updateLoyaltyConfig pending and fulfilled actions
    builder.addCase(updateLoyaltyConfig.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(updateLoyaltyConfig.fulfilled, (state: any) => {
      state.loading = false;
    });
    builder.addCase(updateLoyaltyConfig.rejected, (state: any, action) => {
      state.loading = false;
      state.error = action.payload;
    });

    // Handle deleteLoyaltyConfig pending and fulfilled actions
    builder.addCase(deleteLoyaltyConfig.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(deleteLoyaltyConfig.fulfilled, (state, action) => {
      state.loading = false;
      // Assuming payload is the deleted loyaltyId
      state.loyaltyConfigs = state.loyaltyConfigs.filter(
        (loyalty: any) => loyalty.id !== action.payload,
      );
    });
    builder.addCase(deleteLoyaltyConfig.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    });

    // Handle getLoyaltyConfigById pending and fulfilled actions
    builder.addCase(getLoyaltyConfigById.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(getLoyaltyConfigById.fulfilled, (state, action) => {
      state.loading = false;
      state.selectedLoyaltyConfig = action.payload;
    });
    builder.addCase(getLoyaltyConfigById.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    });

    // Handle getAllLoyaltyConfigs pending and fulfilled actions
    builder.addCase(getAllLoyaltyConfigs.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(getAllLoyaltyConfigs.fulfilled, (state, action) => {
      state.loading = false;
      state.loyaltyConfigs = action.payload;
    });
    builder.addCase(getAllLoyaltyConfigs.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    });
  },
});

// Export actions and reducer
export const { clearLoyaltyConfig } = loyaltySlice.actions;
export default loyaltySlice.reducer;
