import { createEventAPI } from "@/api/events/create-event";
import { deleteTierEventAPI } from "@/api/events/delete-tier-event";
import { getTierEventAPI } from "@/api/events/get-tier-event";
import { listEventsAPI } from "@/api/events/list-events";
import { updateTierEventAPI } from "@/api/events/update-tier-event";
import type { PayloadAction } from "@reduxjs/toolkit";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

export enum StepEnum {
  INITIAL = "initial",
  SET_EVENT_DATA = "seteventdata",
  LIST_TABLE_STAGE = "TableView",
}
export enum eventTypeOptionsEnum {
  ORDER_CREATE = "ORDER_CREATE",
  SIGN_UP = "SIGN_UP",
}

export const eventTypeOptions = [
  { label: "Select an option", value: "" },
  { label: "Order Create", value: eventTypeOptionsEnum.ORDER_CREATE },
  { label: "Sign UP", value: eventTypeOptionsEnum.SIGN_UP },
];

export interface EventState {
  selectedEvent: any | null;
  eventStage: StepEnum;
  loading: boolean;
  error: string | null;
  loyaltyEvents: any[];
  selectedLoyaltyEvent: any | null;
}

const initialState: EventState = {
  selectedEvent: null,
  eventStage: StepEnum.INITIAL,
  loading: false,
  error: null,
  loyaltyEvents: [], // Assuming this stores the list of loyalty configurations
  selectedLoyaltyEvent: null,
};

// Define async thunk for creating loyalty configuration
export const createLoyaltyEvent: any = createAsyncThunk(
  "loyaltyEvent/create",
  async (loyaltyData: any, thunkAPI) => {
    try {
      const response = await createEventAPI(loyaltyData);
      return response.data;
    } catch (error: any) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  },
);

// Define async thunk for updating loyalty configuration
export const updateLoyaltyEvent: any = createAsyncThunk(
  "loyaltyEvent/update",
  async (loyaltyData: any, thunkAPI) => {
    try {
      const response = await updateTierEventAPI(
        loyaltyData.id,
        loyaltyData.loyaltyEventData,
      );
      return response.data;
    } catch (error: any) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  },
);

export const deleteLoyaltyEvent: any = createAsyncThunk(
  "loyaltyEvent/delete",
  async (loyaltyId: any, thunkAPI) => {
    try {
      await deleteTierEventAPI(loyaltyId);
      return loyaltyId; // Return the deleted loyaltyId
    } catch (error: any) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  },
);

// Define async thunk for fetching a single loyalty configuration by ID
export const getLoyaltyEventById: any = createAsyncThunk(
  "loyaltyEvent/getById",
  async (loyaltyId: string, thunkAPI) => {
    try {
      const response: any = getTierEventAPI(loyaltyId);
      return response;
    } catch (error: any) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  },
);

// Define async thunk for fetching all loyalty configurations
export const getAllLoyaltyEvents: any = createAsyncThunk(
  "loyaltyEvent/getAll",
  async (_, thunkAPI) => {
    try {
      console.log("token");
      const response = await listEventsAPI();
      console.log("response", response);
      return response;
    } catch (error: any) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  },
);

export const eventSlice = createSlice({
  name: "event",
  initialState,
  reducers: {
    clearSelectedLoyaltyEvent: (state) => {
      state.selectedLoyaltyEvent = null;
    },
    setSelectedEvent: (state, action: PayloadAction<string | null>) => {
      state.selectedEvent = action.payload;
    },
    setEventStage: (state, action: PayloadAction<StepEnum>) => {
      state.eventStage = action.payload;
    },
  },
  extraReducers: (builder) => {
    // Handle createLoyaltyEvent pending and fulfilled actions
    builder.addCase(createLoyaltyEvent.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(createLoyaltyEvent.fulfilled, (state) => {
      state.loading = false;
    });
    builder.addCase(createLoyaltyEvent.rejected, (state: any, action) => {
      state.loading = false;
      state.error = action.payload;
    });

    // Handle updateLoyaltyEvent pending and fulfilled actions
    builder.addCase(updateLoyaltyEvent.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(updateLoyaltyEvent.fulfilled, (state: any) => {
      state.loading = false;
    });
    builder.addCase(updateLoyaltyEvent.rejected, (state: any, action) => {
      state.loading = false;
      state.error = action.payload;
    });

    // Handle deleteLoyaltyEvent pending and fulfilled actions
    builder.addCase(deleteLoyaltyEvent.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(deleteLoyaltyEvent.fulfilled, (state, action) => {
      state.loading = false;
      // Assuming payload is the deleted loyaltyId
      state.loyaltyEvents = state.loyaltyEvents.filter(
        (loyalty: any) => loyalty.id !== action.payload,
      );
    });
    builder.addCase(deleteLoyaltyEvent.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    });

    // Handle getLoyaltyEventById pending and fulfilled actions
    builder.addCase(getLoyaltyEventById.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(getLoyaltyEventById.fulfilled, (state, action) => {
      state.loading = false;
      // Assuming payload is the fetched loyalty tier object
      state.selectedLoyaltyEvent = action.payload;
      console.log("selectedLoyaltynnnnnnEvent", state.selectedLoyaltyEvent);
    });
    builder.addCase(getLoyaltyEventById.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    });

    // Handle getAllLoyaltyEvents pending and fulfilled actions
    builder.addCase(getAllLoyaltyEvents.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(getAllLoyaltyEvents.fulfilled, (state, action) => {
      state.loading = false;
      // Assuming payload is an array of loyalty tier objects
      state.loyaltyEvents = action.payload;
    });
    builder.addCase(getAllLoyaltyEvents.rejected, (state, action) => {
      state.loading = false;

      state.error = action.payload;
    });
  },
});

export const { setSelectedEvent, setEventStage, clearSelectedLoyaltyEvent } =
  eventSlice.actions;

export default eventSlice.reducer;
