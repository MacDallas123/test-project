//const { createSlice, createAsyncThunk } = require("@reduxjs/toolkit");
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios from '@/api/axios';

const initialState = {
    currentCV: null,
    loading: false,
    error: null,
};

// GET fetch CV
export const fetchCVById = createAsyncThunk(
  "cv/fetchCVById",
  async (id, { rejectWithValue }) => {
    try {
      const response = await axios.get(`/cv/${id}`);
      return response.data;
    } catch (error) {
      console.log("GET CV ERROR", error);
      return rejectWithValue(error.response?.data?.message || "Erreur lors de la recuperation du CV");
    }
  }
);

// POST create new CV
export const createCV = createAsyncThunk(
  "cv/createCV",
  async (data, { rejectWithValue }) => {
    try {
      const response = await axios.post("/cv", data);
      return response.data;
    } catch (error) {
      console.log("CREATE CV ERROR", error);
      return rejectWithValue(error.response?.data?.message || "Erreur lors de la création du CV");
    }
  }
);

// PATCH update CV
export const updateCVById = createAsyncThunk(
  "cv/updateCVById",
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const response = await axios.patch(`/cv/${id}`, data);
      return response.data;
    } catch (error) {
      console.log("UPDATE CV ERROR", error);
      return rejectWithValue(error.response?.data?.message || "Erreur lors de la mise a jour du CV");
    }
  }
);

export const generateCV = createAsyncThunk(
  "cv/generateCV",
  async ({ id, format = 'pdf' }, { rejectWithValue }) => {
    try {
      const response = await axios.post(`/cv/${id}/generate?format=${format}`);
      return response.data;
    } catch (error) {
      console.log("GENERATE CV ERROR", error);
      return rejectWithValue(error.response?.data?.message || "Erreur lors de la génération du CV");
    }
  }
);

// Slice
const cvSlice = createSlice({
    name: 'cv',
    initialState,
    reducers: {
        clearError: (state) => {
            state.error = null;
        },

        setPersoError: (state, action) => {
            state.error = action.payload;
        },

        setCurrentCV: (state, action) => {
            state.currentCV = action.payload.CV;
        },

        clearCV: (state) => {
            state.currentCV = null;
        }
    },
    extraReducers: (builder) => {
        // fetchCVById
        builder
        .addCase(fetchCVById.pending, (state) => {
            state.loading = true;
            state.error = null;
        })
        .addCase(fetchCVById.fulfilled, (state, action) => {
            state.loading = false;
            state.currentCV = action.payload.content;
            state.error = null;
        })
        .addCase(fetchCVById.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload || "Erreur lors de la récupération du profil";
        });

        // createCV
        builder
        .addCase(createCV.pending, (state) => {
            state.loading = true;
            state.error = null;
        })
        .addCase(createCV.fulfilled, (state, action) => {
            state.loading = false;
            state.currentCV = action.payload.content;
            // Optionally update users list or currentUser if needed
            state.error = null;
        })
        .addCase(createCV.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload || "Erreur lors de la modification du CV";
        });

        // updateUserById
        builder
        .addCase(updateCVById.pending, (state) => {
            state.loading = true;
            state.error = null;
        })
        .addCase(updateCVById.fulfilled, (state, action) => {
            state.loading = false;
            state.currentCV = action.payload.content;
            state.error = null;
        })
        .addCase(updateCVById.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload || "Erreur lors de la modification de l'utilisateur";
        });

        builder
        .addCase(generateCV.pending, (state) => {
          state.loading = true;
          state.error = null;
        })
        .addCase(generateCV.fulfilled, (state, action) => {
          state.loading = false;
          state.generatedCV = action.payload.content;
          state.error = null;
        })
        .addCase(generateCV.rejected, (state, action) => {
          state.loading = false;
          state.error = action.payload || "Erreur lors de la génération du CV";
        });
    }
});

export const { 
  clearError,
  setPersoError,
  setCurrentCV,
  clearCV } = cvSlice.actions;

export default cvSlice.reducer;

export const selectCurrentCV = (state) => state.cv.currentCV;
export const selectCVLoading = (state) => state.cv.loading;
export const selectCVError = (state) => state.cv.error;
// export const selectUserStats = (state) => state.cv.stats;
// export const selectUserActivity = (state) => state.cv.activity;
