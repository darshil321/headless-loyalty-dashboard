import { combineReducers } from "@reduxjs/toolkit";
import menuReducer from "./menu/menuSlice";
import tierReducer from "./tier/tierSlice";
import sessionSlice from "./session/sessionSlice";
import eventSlice from "./event/eventSlice";
import userReducer from "./user/userSlice";
import transactionReducer from "./transaction/transactionSlice";
import configReducer from "./config/configSlice";

const rootReducer = combineReducers({
  menu: menuReducer,
  tier: tierReducer,
  session: sessionSlice,
  event: eventSlice,
  user: userReducer,
  transaction: transactionReducer,
  config: configReducer,
});

export default rootReducer;
