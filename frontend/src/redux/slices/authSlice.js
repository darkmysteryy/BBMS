// redux/slices/authSlice.js
// Manages logged-in user state

import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../api/axiosConfig";

// ─── Async Thunks ──────────────────────────────────────────────────────────────

// Login thunk — sends email/password to backend
export const loginUser = createAsyncThunk("auth/login", async (credentials, thunkAPI) => {
  try {
    const response = await api.post("/auth/login", credentials);
    const { token, role, name, id } = response.data.data;

    // Save token and user info in localStorage so they persist on refresh
    localStorage.setItem("token", token);
    localStorage.setItem("user", JSON.stringify({ role, name, id }));

    return { token, role, name, id };
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response?.data?.message || "Login failed");
  }
});

// Register Donor
export const registerDonor = createAsyncThunk("auth/registerDonor", async (data, thunkAPI) => {
  try {
    const response = await api.post("/auth/register-donor", data);
    const { token, role, name, registrationId } = response.data.data;
    localStorage.setItem("token", token);
    localStorage.setItem("user", JSON.stringify({ role, name, registrationId }));
    return { token, role, name, registrationId };
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response?.data?.message || "Registration failed");
  }
});

// Register Hospital
export const registerHospital = createAsyncThunk("auth/registerHospital", async (data, thunkAPI) => {
  try {
    const response = await api.post("/auth/register-hospital", data);
    const { token, role, name, registrationId } = response.data.data;
    localStorage.setItem("token", token);
    localStorage.setItem("user", JSON.stringify({ role, name, registrationId }));
    return { token, role, name, registrationId };
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response?.data?.message || "Registration failed");
  }
});

// ─── Slice ─────────────────────────────────────────────────────────────────────

// Load initial state from localStorage (so user stays logged in on refresh)
const storedUser = JSON.parse(localStorage.getItem("user") || "null");
const storedToken = localStorage.getItem("token");

const authSlice = createSlice({
  name: "auth",
  initialState: {
    user: storedUser,
    token: storedToken,
    loading: false,
    error: null,
  },
  reducers: {
    // Logout — clear everything
    logout: (state) => {
      state.user = null;
      state.token = null;
      localStorage.removeItem("token");
      localStorage.removeItem("user");
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    // Login
    builder
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
        state.token = action.payload.token;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // Register Donor
    builder
      .addCase(registerDonor.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(registerDonor.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
        state.token = action.payload.token;
      })
      .addCase(registerDonor.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // Register Hospital
    builder
      .addCase(registerHospital.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(registerHospital.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
        state.token = action.payload.token;
      })
      .addCase(registerHospital.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { logout, clearError } = authSlice.actions;
export default authSlice.reducer;
