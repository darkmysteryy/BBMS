// redux/store.js
// Central Redux store — combines all slices

import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slices/authSlice";
import donorReducer from "./slices/donorSlice";
import hospitalReducer from "./slices/hospitalSlice";
import inventoryReducer from "./slices/inventorySlice";
import requestReducer from "./slices/requestSlice";
import reportReducer from "./slices/reportSlice";

const store = configureStore({
  reducer: {
    auth: authReducer,
    donor: donorReducer,
    hospital: hospitalReducer,
    inventory: inventoryReducer,
    requests: requestReducer,
    reports: reportReducer,
  },
});

export default store;
