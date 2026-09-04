// redux/slices/requestSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../api/axiosConfig";

// Donor posts a public blood request
export const postBloodRequest = createAsyncThunk("requests/post", async (data, thunkAPI) => {
  try {
    const res = await api.post("/requests", data);
    return res.data.data;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response?.data?.message || "Failed to post request");
  }
});

// Donor fetches their own requests
export const fetchMyRequests = createAsyncThunk("requests/fetchMine", async (_, thunkAPI) => {
  try {
    const res = await api.get("/requests/my");
    return res.data.data;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response?.data?.message || "Failed to fetch requests");
  }
});

// Donor cancels their own Open request
export const cancelBloodRequest = createAsyncThunk("requests/cancel", async (id, thunkAPI) => {
  try {
    const res = await api.put(`/requests/${id}/cancel`);
    return res.data.data;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response?.data?.message || "Failed to cancel request");
  }
});

// Hospital fetches all open public requests
export const fetchOpenRequests = createAsyncThunk("requests/fetchOpen", async (params = {}, thunkAPI) => {
  try {
    const res = await api.get("/requests/open", { params });
    return res.data.data;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response?.data?.message || "Failed to fetch open requests");
  }
});

// Hospital fetches requests it has accepted
export const fetchAcceptedRequests = createAsyncThunk("requests/fetchAccepted", async (_, thunkAPI) => {
  try {
    const res = await api.get("/requests/accepted");
    return res.data.data;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response?.data?.message || "Failed to fetch accepted requests");
  }
});

// Hospital accepts an open request (atomic — only first wins)
export const acceptRequest = createAsyncThunk("requests/accept", async (id, thunkAPI) => {
  try {
    const res = await api.put(`/requests/${id}/accept`);
    return res.data.data;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response?.data?.message || "Failed to accept request");
  }
});

// Hospital fulfils an accepted request
export const fulfilRequest = createAsyncThunk("requests/fulfil", async (id, thunkAPI) => {
  try {
    const res = await api.put(`/requests/${id}/fulfil`);
    return res.data.data;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response?.data?.message || "Failed to fulfil request");
  }
});

const requestSlice = createSlice({
  name: "requests",
  initialState: {
    myRequests: [],       // donor's own requests
    openRequests: [],     // all open requests (for hospitals)
    acceptedRequests: [], // requests accepted by this hospital
    loading: false,
    error: null,
    successMessage: null,
  },
  reducers: {
    clearRequestError: (state) => { state.error = null; },
    clearRequestSuccess: (state) => { state.successMessage = null; },
    requestAddedRealTime: (state, action) => {
      const exists = state.openRequests.find(r => r._id === action.payload._id);
      if (!exists) {
        state.openRequests.unshift(action.payload);
      }
    },
    requestUpdatedRealTime: (state, action) => {
      const updatedRequest = action.payload;
      
      // Update in donor's myRequests
      const myIdx = state.myRequests.findIndex(r => r._id === updatedRequest._id);
      if (myIdx !== -1) {
        state.myRequests[myIdx] = updatedRequest;
      }
      
      // Remove from openRequests since it's no longer open (if it was accepted)
      if (updatedRequest.status !== "Open") {
        state.openRequests = state.openRequests.filter(r => r._id !== updatedRequest._id);
      } else {
        // If it's still open (e.g. just a text edit, which isn't currently supported but for safety)
        const openIdx = state.openRequests.findIndex(r => r._id === updatedRequest._id);
        if (openIdx !== -1) {
          state.openRequests[openIdx] = updatedRequest;
        }
      }
    }
  },
  extraReducers: (builder) => {
    builder
      // Post request
      .addCase(postBloodRequest.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(postBloodRequest.fulfilled, (state, action) => {
        state.loading = false;
        state.myRequests.unshift(action.payload);
        state.successMessage = "Blood request posted! Nearby hospitals will see it.";
      })
      .addCase(postBloodRequest.rejected, (state, action) => { state.loading = false; state.error = action.payload; })

      // My requests (donor)
      .addCase(fetchMyRequests.pending, (state) => { state.loading = true; })
      .addCase(fetchMyRequests.fulfilled, (state, action) => { state.loading = false; state.myRequests = action.payload; })
      .addCase(fetchMyRequests.rejected, (state, action) => { state.loading = false; state.error = action.payload; })

      // Cancel request
      .addCase(cancelBloodRequest.fulfilled, (state, action) => {
        const idx = state.myRequests.findIndex((r) => r._id === action.payload._id);
        if (idx !== -1) state.myRequests[idx] = action.payload;
      })

      // Open requests (hospital feed)
      .addCase(fetchOpenRequests.pending, (state) => { state.loading = true; })
      .addCase(fetchOpenRequests.fulfilled, (state, action) => { state.loading = false; state.openRequests = action.payload; })
      .addCase(fetchOpenRequests.rejected, (state, action) => { state.loading = false; state.error = action.payload; })

      // Accepted requests (hospital)
      .addCase(fetchAcceptedRequests.pending, (state) => { state.loading = true; })
      .addCase(fetchAcceptedRequests.fulfilled, (state, action) => { state.loading = false; state.acceptedRequests = action.payload; })
      .addCase(fetchAcceptedRequests.rejected, (state, action) => { state.loading = false; state.error = action.payload; })

      // Accept request
      .addCase(acceptRequest.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(acceptRequest.fulfilled, (state, action) => {
        state.loading = false;
        // Remove from open list, add to accepted list
        state.openRequests = state.openRequests.filter((r) => r._id !== action.payload._id);
        state.acceptedRequests.unshift(action.payload);
        state.successMessage = "Request accepted! Please fulfil it from your inventory.";
      })
      .addCase(acceptRequest.rejected, (state, action) => { state.loading = false; state.error = action.payload; })

      // Fulfil request
      .addCase(fulfilRequest.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(fulfilRequest.fulfilled, (state, action) => {
        state.loading = false;
        const idx = state.acceptedRequests.findIndex((r) => r._id === action.payload._id);
        if (idx !== -1) state.acceptedRequests[idx] = action.payload;
        state.successMessage = "Request fulfilled! Inventory updated.";
      })
      .addCase(fulfilRequest.rejected, (state, action) => { state.loading = false; state.error = action.payload; });
  },
});

export const { clearRequestError, clearRequestSuccess, requestAddedRealTime, requestUpdatedRealTime } = requestSlice.actions;
export default requestSlice.reducer;
