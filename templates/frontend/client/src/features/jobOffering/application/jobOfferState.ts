import { SerializedError, createSlice } from "@reduxjs/toolkit";
import { jobOfferApi } from "../infrastructure/jobOfferApi";
import { JobOfferDto } from "./types/jobOfferTypes";

interface JobOfferState {
  jobOffers: JobOfferDto[];
  loading: boolean;
  error: SerializedError | null;
}

const initialState: JobOfferState = {
  jobOffers: [],
  loading: false,
  error: null,
};

const jobOfferSlice = createSlice({
  name: "jobOffer",
  initialState,
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
          state.jobOffers = action.payload;
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
