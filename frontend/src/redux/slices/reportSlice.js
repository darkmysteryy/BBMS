// redux/slices/reportSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../api/axiosConfig";

export const fetchMonthlyDonations = createAsyncThunk("reports/monthly", async (_, thunkAPI) => {
  try {
    const res = await api.get("/reports/monthly-donations");
    return res.data.data;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response?.data?.message || "Failed");
  }
});

export const fetchBloodGroupDistribution = createAsyncThunk("reports/bloodGroups", async (_, thunkAPI) => {
  try {
    const res = await api.get("/reports/blood-groups");
    return res.data.data;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response?.data?.message || "Failed");
  }
});

export const fetchRequestsSummary = createAsyncThunk("reports/requestsSummary", async (_, thunkAPI) => {
  try {
    const res = await api.get("/reports/requests-summary");
    return res.data.data;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response?.data?.message || "Failed");
  }
});

export const fetchAdminStats = createAsyncThunk("reports/adminStats", async (_, thunkAPI) => {
  try {
    const res = await api.get("/admin/stats");
    return res.data.data;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response?.data?.message || "Failed");
  }
});

const reportSlice = createSlice({
  name: "reports",
  initialState: {
    monthlyDonations: [],
    bloodGroupDistribution: [],
    requestsSummary: [],
    adminStats: null,
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchMonthlyDonations.pending, (state) => { state.loading = true; })
      .addCase(fetchMonthlyDonations.fulfilled, (state, action) => { state.loading = false; state.monthlyDonations = action.payload; })
      .addCase(fetchMonthlyDonations.rejected, (state, action) => { state.loading = false; state.error = action.payload; })

      .addCase(fetchBloodGroupDistribution.fulfilled, (state, action) => { state.bloodGroupDistribution = action.payload; })
      .addCase(fetchRequestsSummary.fulfilled, (state, action) => { state.requestsSummary = action.payload; })
      .addCase(fetchAdminStats.fulfilled, (state, action) => { state.adminStats = action.payload; });
  },
});

export default reportSlice.reducer;
