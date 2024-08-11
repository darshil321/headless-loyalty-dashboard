/* eslint-disable @typescript-eslint/no-explicit-any */
import { getCustomerAPI } from "@/api/users/get-customer";
import { listCustomersAPI } from "@/api/users/list-customers";
import { updateCustomerAPI } from "@/api/users/update-customer";
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

// Define initial state for the slice
const initialState = {
  loading: false,
  error: null,
  loyaltyUsers: [], // Assuming this stores the list of loyalty configurations
  selectedLoyaltyUser: null, // Assuming this stores the selected loyalty configuration
};

// Define async thunk for creating loyalty configuration
// export const createLoyaltyUser: any = createAsyncThunk(
//   "loyaltyUser/create",
//   async (loyaltyData: any, thunkAPI) => {
//     try {
//       const response = await fetchWithAuth(
//         "/loyalty_wallet",
//         "POST",
//         loyaltyData,
//       );
//       return response.data;
//     } catch (error: any) {
//       return thunkAPI.rejectWithValue(error.response.data);
//     }
//   },
// );

// Define async thunk for updating loyalty configuration
export const updateLoyaltyUser: any = createAsyncThunk(
  "loyaltyUser/update",
  async (loyaltyData: any, thunkAPI) => {
    try {
      const response = await updateCustomerAPI(loyaltyData.id, loyaltyData);
      return response.data;
    } catch (error: any) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  },
);

// export const deleteLoyaltyUser: any = createAsyncThunk(
//   "loyaltyUser/delete",
//   async (loyaltyId, thunkAPI) => {
//     try {
//       await fetchWithAuth(`/loyalty_wallet/${loyaltyId}`, "DELETE");
//       return loyaltyId; // Return the deleted loyaltyId
//     } catch (error: any) {
//       return thunkAPI.rejectWithValue(error.response.data);
//     }
//   },
// );

// Define async thunk for fetching a single loyalty configuration by ID
export const getLoyaltyUserById: any = createAsyncThunk(
  "loyaltyUser/getById",
  async (loyaltyId: any, thunkAPI) => {
    try {
      const response = await getCustomerAPI(loyaltyId);
      return response;
    } catch (error: any) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  },
);

// Define async thunk for fetching all loyalty configurations
export const getAllLoyaltyUsers: any = createAsyncThunk(
  "loyaltyUser/getAll",
  async (_, thunkAPI) => {
    try {
      const response = await listCustomersAPI();
      return response;
    } catch (error: any) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  },
);

// Create the loyalty slice
const loyaltySlice = createSlice({
  name: "loyaltyUser",
  initialState,
  reducers: {
    clearLoyaltyCustomer: (state) => {
      state.selectedLoyaltyUser = null;
    },
  },
  extraReducers: (builder) => {
    // Handle createLoyaltyUser pending and fulfilled actions
    // builder.addCase(createLoyaltyUser.pending, (state) => {
    //   state.loading = true;
    // });
    // builder.addCase(createLoyaltyUser.fulfilled, (state) => {
    //   state.loading = false;
    // });
    // builder.addCase(createLoyaltyUser.rejected, (state: any, action) => {
    //   state.loading = false;
    //   state.error = action.payload;
    // });

    // Handle updateLoyaltyUser pending and fulfilled actions
    builder.addCase(updateLoyaltyUser.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(updateLoyaltyUser.fulfilled, (state: any) => {
      state.loading = false;
    });
    builder.addCase(updateLoyaltyUser.rejected, (state: any, action) => {
      state.loading = false;
      state.error = action.payload;
    });

    // Handle deleteLoyaltyUser pending and fulfilled actions
    // builder.addCase(deleteLoyaltyUser.pending, (state) => {
    //   state.loading = true;
    // });
    // builder.addCase(deleteLoyaltyUser.fulfilled, (state, action) => {
    //   state.loading = false;
    //   // Assuming payload is the deleted loyaltyId
    //   state.loyaltyUsers = state.loyaltyUsers.filter(
    //     (loyalty: any) => loyalty.id !== action.payload,
    //   );
    // });
    // builder.addCase(deleteLoyaltyUser.rejected, (state, action) => {
    //   state.loading = false;
    //   state.error = action.payload;
    // });

    // Handle getLoyaltyUserById pending and fulfilled actions
    builder.addCase(getLoyaltyUserById.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(getLoyaltyUserById.fulfilled, (state, action) => {
      state.loading = false;
      // Assuming payload is the fetched loyalty user object
      state.selectedLoyaltyUser = action.payload;
    });
    builder.addCase(getLoyaltyUserById.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    });

    // Handle getAllLoyaltyUsers pending and fulfilled actions
    builder.addCase(getAllLoyaltyUsers.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(getAllLoyaltyUsers.fulfilled, (state, action) => {
      state.loading = false;
      // Assuming payload is an array of loyalty user objects
      state.loyaltyUsers = action.payload;
    });
    builder.addCase(getAllLoyaltyUsers.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    });
  },
});

// Export actions and reducer
export const { clearLoyaltyCustomer } = loyaltySlice.actions;
export default loyaltySlice.reducer;
