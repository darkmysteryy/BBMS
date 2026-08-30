// redux/slices/hospitalInventorySlice.js
// Manages this hospital's own blood inventory state
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../api/axiosConfig";

// Fetch this hospital's inventory
export const fetchHospitalInventory = createAsyncThunk("hospitalInventory/fetch", async (params = {}, thunkAPI) => {
  try {
    const res = await api.get("/inventory", { params });
    return res.data.data;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response?.data?.message || "Failed to fetch inventory");
  }
});

// Record a walk-in donor donation
export const recordDonation = createAsyncThunk("hospitalInventory/recordDonation", async (data, thunkAPI) => {
  try {
    const res = await api.post("/donations", data);
    return res.data.data;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response?.data?.message || "Failed to record donation");
  }
});

// Fetch all donations recorded at this hospital
export const fetchHospitalDonations = createAsyncThunk("hospitalInventory/fetchDonations", async (_, thunkAPI) => {
  try {
    const res = await api.get("/donations/hospital");
    return res.data.data;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response?.data?.message || "Failed to fetch donations");
  }
});

const hospitalInventorySlice = createSlice({
  name: "hospitalInventory",
  initialState: {
    inventory: [],
    donations: [],
    lowStockCount: 0,
    loading: false,
    error: null,
    successMessage: null,
  },
  reducers: {
    clearHospitalInventoryError: (state) => { state.error = null; },
    clearHospitalInventorySuccess: (state) => { state.successMessage = null; },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchHospitalInventory.pending, (state) => { state.loading = true; })
      .addCase(fetchHospitalInventory.fulfilled, (state, action) => {
        state.loading = false;
        state.inventory = action.payload.inventory;
        state.lowStockCount = action.payload.lowStockCount;
      })
      .addCase(fetchHospitalInventory.rejected, (state, action) => { state.loading = false; state.error = action.payload; })

      .addCase(recordDonation.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(recordDonation.fulfilled, (state, action) => {
        state.loading = false;
        state.donations.unshift(action.payload);
        state.successMessage = "Donation recorded and added to inventory!";
      })
      .addCase(recordDonation.rejected, (state, action) => { state.loading = false; state.error = action.payload; })

      .addCase(fetchHospitalDonations.pending, (state) => { state.loading = true; })
      .addCase(fetchHospitalDonations.fulfilled, (state, action) => { state.loading = false; state.donations = action.payload; })
      .addCase(fetchHospitalDonations.rejected, (state, action) => { state.loading = false; state.error = action.payload; });
  },
});

export const { clearHospitalInventoryError, clearHospitalInventorySuccess } = hospitalInventorySlice.actions;
export default hospitalInventorySlice.reducer;
