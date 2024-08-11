/* eslint-disable @typescript-eslint/no-explicit-any */
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  selectedMenuItem: "home", // Initial selected menu item
};

const menuSlice = createSlice({
  name: "menu",
  initialState,
  reducers: {
    selectMenuItem: (state, action) => {
      state.selectedMenuItem = action.payload;
    },
  },
});

export const { selectMenuItem } = menuSlice.actions;

export const selectSelectedMenuItem = (state: any) =>
  state.menu.selectedMenuItem;

export default menuSlice.reducer;
