import { createSlice } from "@reduxjs/toolkit";

const uiSlice = createSlice({
  name: "ui",
  initialState: { loading: false },
  reducers: {
    setLoader: (state, action) => {
      state.loading = action.payload;
    },
  },
});

export const { setLoader } = uiSlice.actions;

export default uiSlice.reducer;
