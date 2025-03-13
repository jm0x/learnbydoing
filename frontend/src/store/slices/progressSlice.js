import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import progressService from '../../services/progressService';

export const fetchUserProgress = createAsyncThunk(
  'progress/fetchUserProgress',
  async (_, { rejectWithValue }) => {
    try {
      return await progressService.getUserProgress();
    } catch (error) {
      return rejectWithValue(error.response?.data?.detail || 'Failed to fetch user progress');
    }
  }
);

export const updateProgress = createAsyncThunk(
  'progress/updateProgress',
  async ({ problemId, data }, { rejectWithValue }) => {
    try {
      return await progressService.updateProgress(problemId, data);
    } catch (error) {
      return rejectWithValue(error.response?.data?.detail || 'Failed to update progress');
    }
  }
);

const initialState = {
  userProgress: [],
  currentProgress: null,
  isLoading: false,
  error: null,
};

const progressSlice = createSlice({
  name: 'progress',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUserProgress.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchUserProgress.fulfilled, (state, action) => {
        state.isLoading = false;
        state.userProgress = action.payload;
      })
      .addCase(fetchUserProgress.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      .addCase(updateProgress.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(updateProgress.fulfilled, (state, action) => {
        state.isLoading = false;
        state.currentProgress = action.payload;
        // Update the progress in the list
        const index = state.userProgress.findIndex(p => p.problem_id === action.payload.problem_id);
        if (index !== -1) {
          state.userProgress[index] = action.payload;
        } else {
          state.userProgress.push(action.payload);
        }
      })
      .addCase(updateProgress.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });
  },
});

export const { clearError } = progressSlice.actions;
export default progressSlice.reducer;
