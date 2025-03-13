import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import problemService from '../../services/problemService';

export const fetchProblems = createAsyncThunk(
  'problems/fetchProblems',
  async (_, { rejectWithValue }) => {
    try {
      return await problemService.getProblems();
    } catch (error) {
      return rejectWithValue(error.response?.data?.detail || 'Failed to fetch problems');
    }
  }
);

export const fetchProblemById = createAsyncThunk(
  'problems/fetchProblemById',
  async (id, { rejectWithValue }) => {
    try {
      return await problemService.getProblemById(id);
    } catch (error) {
      return rejectWithValue(error.response?.data?.detail || 'Failed to fetch problem');
    }
  }
);

const initialState = {
  problems: [],
  currentProblem: null,
  isLoading: false,
  error: null,
};

const problemSlice = createSlice({
  name: 'problems',
  initialState,
  reducers: {
    clearCurrentProblem: (state) => {
      state.currentProblem = null;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProblems.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchProblems.fulfilled, (state, action) => {
        state.isLoading = false;
        state.problems = action.payload;
      })
      .addCase(fetchProblems.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      .addCase(fetchProblemById.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchProblemById.fulfilled, (state, action) => {
        state.isLoading = false;
        state.currentProblem = action.payload;
      })
      .addCase(fetchProblemById.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });
  },
});

export const { clearCurrentProblem, clearError } = problemSlice.actions;
export default problemSlice.reducer;
