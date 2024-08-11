// /* eslint-disable @typescript-eslint/no-explicit-any */
// import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
// import { fetchWithAuth } from "../../utils/fetchAuthApis";

// // Define initial state for the slice
// const initialState = {
//   loading: false,
//   error: null,
//   loyaltyTransaction: [], // Assuming this stores the list of loyalty configurations
//   selectedLoyaltyTransaction: null, // Assuming this stores the selected loyalty configuration
// };

// // Define async thunk for updating loyalty configuration
// export const updateLoyaltyTransaction: any = createAsyncThunk(
//   "loyaltyTransaction/update",
//   async (loyaltyData: any, thunkAPI) => {
//     try {
//       const response = await fetchWithAuth(
//         `/transaction/${loyaltyData.id}`,
//         "PUT",
//         loyaltyData
//       );
//       return response.data;
//     } catch (error: any) {
//       return thunkAPI.rejectWithValue(error.response.data);
//     }
//   }
// );

// export const deleteLoyaltyTransaction: any = createAsyncThunk(
//   "loyaltyTransaction/delete",
//   async (loyaltyId, thunkAPI) => {
//     try {
//       await fetchWithAuth(`/transaction/${loyaltyId}`, "DELETE");
//       return loyaltyId; // Return the deleted loyaltyId
//     } catch (error: any) {
//       return thunkAPI.rejectWithValue(error.response.data);
//     }
//   }
// );

// // Define async thunk for fetching a single loyalty configuration by ID
// export const getLoyaltyTransactionById: any = createAsyncThunk(
//   "loyaltyTransaction/getById",
//   async (loyaltyId, thunkAPI) => {
//     try {
//       const response = await fetchWithAuth(`/transaction/${loyaltyId}`, "GET");
//       return response.data;
//     } catch (error: any) {
//       return thunkAPI.rejectWithValue(error.response.data);
//     }
//   }
// );

// // Define async thunk for fetching all loyalty configurations
// export const getAllLoyaltyTransaction: any = createAsyncThunk(
//   "loyaltyTransaction/getAll",
//   async (userId, thunkAPI) => {
//     try {
//       const response = await fetchWithAuth("/transaction/" + userId, "GET");
//       return response.data;
//     } catch (error: any) {
//       return thunkAPI.rejectWithValue(error.response.data);
//     }
//   }
// );

// // Create the loyalty slice
// const loyaltySlice = createSlice({
//   name: "loyaltyTransaction",
//   initialState,
//   reducers: {},
//   extraReducers: (builder) => {
//     // Handle createLoyaltyTier pending and fulfilled actions

//     // Handle updateLoyaltyTransaction pending and fulfilled actions
//     builder.addCase(updateLoyaltyTransaction.pending, (state) => {
//       state.loading = true;
//     });
//     builder.addCase(updateLoyaltyTransaction.fulfilled, (state: any) => {
//       state.loading = false;
//     });
//     builder.addCase(updateLoyaltyTransaction.rejected, (state: any, action) => {
//       state.loading = false;
//       state.error = action.payload;
//     });

//     // Handle deleteLoyaltyTransaction pending and fulfilled actions
//     builder.addCase(deleteLoyaltyTransaction.pending, (state) => {
//       state.loading = true;
//     });
//     builder.addCase(deleteLoyaltyTransaction.fulfilled, (state, action) => {
//       state.loading = false;
//       // Assuming payload is the deleted loyaltyId
//       state.loyaltyTransaction = state.loyaltyTransaction.filter(
//         (loyalty: any) => loyalty.id !== action.payload
//       );
//     });
//     builder.addCase(deleteLoyaltyTransaction.rejected, (state, action) => {
//       state.loading = false;
//       state.error = action.payload;
//     });

//     // Handle getLoyaltyTransactionById pending and fulfilled actions
//     builder.addCase(getLoyaltyTransactionById.pending, (state) => {
//       state.loading = true;
//     });
//     builder.addCase(getLoyaltyTransactionById.fulfilled, (state, action) => {
//       state.loading = false;
//       // Assuming payload is the fetched loyalty transaction object
//       state.selectedLoyaltyTransaction = action.payload;
//     });
//     builder.addCase(getLoyaltyTransactionById.rejected, (state, action) => {
//       state.loading = false;
//       state.error = action.payload;
//     });

//     // Handle getAllLoyaltyTransaction pending and fulfilled actions
//     builder.addCase(getAllLoyaltyTransaction.pending, (state) => {
//       state.loading = true;
//     });
//     builder.addCase(getAllLoyaltyTransaction.fulfilled, (state, action) => {
//       state.loading = false;
//       // Assuming payload is an array of loyalty transaction objects
//       state.loyaltyTransaction = action.payload;
//     });
//     builder.addCase(getAllLoyaltyTransaction.rejected, (state, action) => {
//       state.loading = false;
//       state.error = action.payload;
//     });
//   },
// });

// // Export actions and reducer
// // export const {} = loyaltySlice.actions;
// export default loyaltySlice.reducer;
