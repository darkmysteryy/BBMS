// redux/slices/hospitalSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../api/axiosConfig";

export const fetchHospitalProfile = createAsyncThunk("hospital/fetchProfile", async (_, thunkAPI) => {
  try {
    const res = await api.get("/hospital/profile");
    return res.data.data;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response?.data?.message || "Failed to fetch profile");
  }
});

export const updateHospitalProfile = createAsyncThunk("hospital/updateProfile", async (data, thunkAPI) => {
  try {
    const res = await api.put("/hospital/profile", data);
    return res.data.data;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response?.data?.message || "Failed to update profile");
  }
});

const hospitalSlice = createSlice({
  name: "hospital",
  initialState: {
    profile: null,
    loading: false,
    error: null,
  },
  reducers: {
    clearHospitalError: (state) => { state.error = null; },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchHospitalProfile.pending, (state) => { state.loading = true; })
      .addCase(fetchHospitalProfile.fulfilled, (state, action) => { state.loading = false; state.profile = action.payload; })
      .addCase(fetchHospitalProfile.rejected, (state, action) => { state.loading = false; state.error = action.payload; })

      .addCase(updateHospitalProfile.pending, (state) => { state.loading = true; })
      .addCase(updateHospitalProfile.fulfilled, (state, action) => { state.loading = false; state.profile = action.payload; })
      .addCase(updateHospitalProfile.rejected, (state, action) => { state.loading = false; state.error = action.payload; });
  },
});

export const { clearHospitalError } = hospitalSlice.actions;
export default hospitalSlice.reducer;
