// redux/slices/inventorySlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../api/axiosConfig";

export const fetchInventory = createAsyncThunk("inventory/fetchAll", async (params = {}, thunkAPI) => {
  try {
    const res = await api.get("/inventory", { params });
    return res.data.data;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response?.data?.message || "Failed to fetch inventory");
  }
});

export const addInventoryItem = createAsyncThunk("inventory/add", async (data, thunkAPI) => {
  try {
    const res = await api.post("/inventory", data);
    return res.data.data;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response?.data?.message || "Failed to add inventory");
  }
});

export const updateInventoryItem = createAsyncThunk("inventory/update", async ({ id, data }, thunkAPI) => {
  try {
    const res = await api.put(`/inventory/${id}`, data);
    return res.data.data;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response?.data?.message || "Failed to update");
  }
});

export const deleteInventoryItem = createAsyncThunk("inventory/delete", async (id, thunkAPI) => {
  try {
    await api.delete(`/inventory/${id}`);
    return id; // return the ID so we can remove it from state
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response?.data?.message || "Failed to delete");
  }
});

const inventorySlice = createSlice({
  name: "inventory",
  initialState: {
    items: [],
    lowStockCount: 0,
    loading: false,
    error: null,
  },
  reducers: {
    clearInventoryError: (state) => { state.error = null; },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchInventory.pending, (state) => { state.loading = true; })
      .addCase(fetchInventory.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload.inventory;
        state.lowStockCount = action.payload.lowStockCount;
      })
      .addCase(fetchInventory.rejected, (state, action) => { state.loading = false; state.error = action.payload; })

      .addCase(addInventoryItem.fulfilled, (state, action) => {
        state.items.unshift(action.payload);
      })

      .addCase(updateInventoryItem.fulfilled, (state, action) => {
        const index = state.items.findIndex((i) => i._id === action.payload._id);
        if (index !== -1) state.items[index] = action.payload;
      })

      .addCase(deleteInventoryItem.fulfilled, (state, action) => {
        state.items = state.items.filter((i) => i._id !== action.payload);
      });
  },
});

export const { clearInventoryError } = inventorySlice.actions;
export default inventorySlice.reducer;
