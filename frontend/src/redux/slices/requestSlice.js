// redux/slices/requestSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../api/axiosConfig";

export const fetchRequests = createAsyncThunk("requests/fetchAll", async (params = {}, thunkAPI) => {
  try {
    const res = await api.get("/requests", { params });
    return res.data.data;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response?.data?.message || "Failed to fetch requests");
  }
});

export const createBloodRequest = createAsyncThunk("requests/create", async (data, thunkAPI) => {
  try {
    const res = await api.post("/requests", data);
    return res.data.data;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response?.data?.message || "Failed to submit request");
  }
});

export const updateRequestStatus = createAsyncThunk("requests/updateStatus", async ({ id, status }, thunkAPI) => {
  try {
    const res = await api.put(`/requests/${id}/status`, { status });
    return res.data.data;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response?.data?.message || "Failed to update status");
  }
});

const requestSlice = createSlice({
  name: "requests",
  initialState: {
    requests: [],
    loading: false,
    error: null,
  },
  reducers: {
    clearRequestError: (state) => { state.error = null; },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchRequests.pending, (state) => { state.loading = true; })
      .addCase(fetchRequests.fulfilled, (state, action) => { state.loading = false; state.requests = action.payload; })
      .addCase(fetchRequests.rejected, (state, action) => { state.loading = false; state.error = action.payload; })

      .addCase(createBloodRequest.fulfilled, (state, action) => {
        state.requests.unshift(action.payload);
      })

      .addCase(updateRequestStatus.fulfilled, (state, action) => {
        const index = state.requests.findIndex((r) => r._id === action.payload._id);
        if (index !== -1) state.requests[index] = action.payload;
      });
  },
});

export const { clearRequestError } = requestSlice.actions;
export default requestSlice.reducer;
