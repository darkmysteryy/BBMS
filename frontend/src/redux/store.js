// redux/store.js
import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slices/authSlice";
import donorReducer from "./slices/donorSlice";
import hospitalReducer from "./slices/hospitalSlice";
import inventoryReducer from "./slices/inventorySlice";
import requestReducer from "./slices/requestSlice";
import hospitalInventoryReducer from "./slices/hospitalInventorySlice";

const store = configureStore({
  reducer: {
    auth: authReducer,
    donor: donorReducer,
    hospital: hospitalReducer,
    inventory: inventoryReducer,
    requests: requestReducer,
    hospitalInventory: hospitalInventoryReducer,
  },
});

export default store;
