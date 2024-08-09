import { combineReducers, configureStore } from "@reduxjs/toolkit";
import { eventSlice } from "./slices/eventSlice";

const rootReducer = combineReducers({
  [eventSlice.name]: eventSlice.reducer,
});

export type RootState = ReturnType<typeof rootReducer>;

const store = configureStore({
  reducer: rootReducer,
});

export { store };

export type AppDispatch = typeof store.dispatch;
