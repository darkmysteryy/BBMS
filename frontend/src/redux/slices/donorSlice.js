// redux/slices/donorSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../api/axiosConfig";

export const fetchDonorProfile = createAsyncThunk("donor/fetchProfile", async (_, thunkAPI) => {
  try {
    const res = await api.get("/donor/profile");
    return res.data.data;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response?.data?.message || "Failed to fetch profile");
  }
});

export const updateDonorProfile = createAsyncThunk("donor/updateProfile", async (data, thunkAPI) => {
  try {
    const res = await api.put("/donor/profile", data);
    return res.data.data;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response?.data?.message || "Failed to update profile");
  }
});

export const fetchMyDonations = createAsyncThunk("donor/fetchDonations", async (_, thunkAPI) => {
  try {
    const res = await api.get("/donations/my");
    return res.data.data;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response?.data?.message || "Failed to fetch donations");
  }
});

const donorSlice = createSlice({
  name: "donor",
  initialState: {
    profile: null,
    donations: [],
    loading: false,
    error: null,
  },
  reducers: {
    clearDonorError: (state) => { state.error = null; },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchDonorProfile.pending, (state) => { state.loading = true; })
      .addCase(fetchDonorProfile.fulfilled, (state, action) => { state.loading = false; state.profile = action.payload; })
      .addCase(fetchDonorProfile.rejected, (state, action) => { state.loading = false; state.error = action.payload; })

      .addCase(updateDonorProfile.pending, (state) => { state.loading = true; })
      .addCase(updateDonorProfile.fulfilled, (state, action) => { state.loading = false; state.profile = action.payload; })
      .addCase(updateDonorProfile.rejected, (state, action) => { state.loading = false; state.error = action.payload; })

      .addCase(fetchMyDonations.pending, (state) => { state.loading = true; })
      .addCase(fetchMyDonations.fulfilled, (state, action) => { state.loading = false; state.donations = action.payload; })
      .addCase(fetchMyDonations.rejected, (state, action) => { state.loading = false; state.error = action.payload; });
  },
});

export const { clearDonorError } = donorSlice.actions;
export default donorSlice.reducer;
