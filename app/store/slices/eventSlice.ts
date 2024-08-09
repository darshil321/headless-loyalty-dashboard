import { createSlice } from "@reduxjs/toolkit";
// import type { PayloadAction } from "@reduxjs/toolkit";

export interface EventState {
  selectedEvent: string | null;
}

const initialState: EventState = {
  selectedEvent: null,
};

export const eventSlice = createSlice({
  name: "event",
  initialState,
  reducers: {
    setSelectedEvent: (state, action) => {
      state.selectedEvent = action.payload;
    },
  },
});

export const { setSelectedEvent } = eventSlice.actions;

export default eventSlice.reducer;
