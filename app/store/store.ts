import { combineReducers, configureStore } from "@reduxjs/toolkit";
import { eventSlice } from "./slices/eventSlice";
import { sessionSlice } from "./slices/sessionSlice";

const rootReducer = combineReducers({
  [eventSlice.name]: eventSlice.reducer,
  [sessionSlice.name]: sessionSlice.reducer,
});

export type RootState = ReturnType<typeof rootReducer>;

const store = configureStore({
  reducer: rootReducer,
});

export { store };

export type AppDispatch = typeof store.dispatch;
