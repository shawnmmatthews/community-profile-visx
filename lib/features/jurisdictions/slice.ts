import { createSlice } from '@reduxjs/toolkit';

// The initial state of the ReposManager container
export const initialState = {
  status: 'loading',
  data: [],
  loading: false,
  error: false,
};

const jurisdictionsSlice = createSlice({
  name: 'jurisdictions',
  initialState,
  reducers: {
    fetch(state) {
      state.status = 'loading'
      state.loading = true;
      state.error = false;
      state.data = [];
    },
    fetchSuccess(state, action) {
      state.status = 'success'
      state.data = action.payload.data;
      state.loading = false;
    },
    fetchFailure(state, action) {
      state.status = 'error'
      state.error = action.payload.error;
      state.loading = false;
    },
  },
});

export const { name, actions, reducer } = jurisdictionsSlice;