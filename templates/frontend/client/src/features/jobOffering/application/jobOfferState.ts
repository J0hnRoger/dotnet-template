import { createSlice } from "@reduxjs/toolkit";
import { jobOfferApi } from "../infrastructure/jobOfferApi";

const jobOfferSlice = createSlice({
  name: "jobOffer",
  initialState: {
    jobOfferings: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addMatcher(
        jobOfferApi.endpoints.fetchJobOffers.matchPending,
        (state) => {
          state.loading = true;
          state.error = null;
        }
      )
      .addMatcher(
        jobOfferApi.endpoints.fetchJobOffers.matchFulfilled,
        (state, action) => {
          state.loading = false;
          state.jobOfferings = action.payload;
        }
      )
      .addMatcher(
        jobOfferApi.endpoints.fetchJobOffers.matchRejected,
        (state, action) => {
          state.loading = false;
          state.error = action.error;
        }
      );
  },
});

export default jobOfferSlice.reducer;
