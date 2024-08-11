import type { PayloadAction } from "@reduxjs/toolkit";
import { createSlice } from "@reduxjs/toolkit";

export enum StepEnum {
  INITIAL = "initial",
  SET_EVENT_DATA = "seteventdata",
  LIST_TABLE_STAGE = "TableView",
}
export enum eventTypeOptionsEnum {
  ORDER_CREATE = "order create",
  SIGN_UP = "sign up",
}

export const eventTypeOptions = [
  { label: "Order Create", value: eventTypeOptionsEnum.ORDER_CREATE },
  { label: "Sign UP", value: eventTypeOptionsEnum.SIGN_UP },
];

export interface EventState {
  selectedEvent: string | null;
  eventStage: StepEnum;
}

const initialState: EventState = {
  selectedEvent: null,
  eventStage: StepEnum.INITIAL,
};

export const eventSlice = createSlice({
  name: "event",
  initialState,
  reducers: {
    setSelectedEvent: (state, action: PayloadAction<string | null>) => {
      state.selectedEvent = action.payload;
    },
    setEventStage: (state, action: PayloadAction<StepEnum>) => {
      state.eventStage = action.payload;
    },
  },
});

export const { setSelectedEvent, setEventStage } = eventSlice.actions;

export default eventSlice.reducer;
