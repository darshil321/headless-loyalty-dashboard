import { createSlice } from "@reduxjs/toolkit";
// import type { PayloadAction } from "@reduxjs/toolkit";

export interface sessionState {
  sessionToken: string | null;
}

const initialState: sessionState = {
  sessionToken: null,
};

export const sessionSlice = createSlice({
  name: "session",
  initialState,
  reducers: {
    setSessionToken: (state, action) => {
      state.sessionToken = action.payload;
    },
  },
});

export const { setSessionToken } = sessionSlice.actions;

export default sessionSlice.reducer;
