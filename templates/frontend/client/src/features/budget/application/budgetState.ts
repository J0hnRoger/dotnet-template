import { SerializedError, createSlice } from "@reduxjs/toolkit";
import { jobOfferApi, transactionApi } from "../infrastructure/transactionApi";
import { TransactionDto } from "./types/budgetTypes";

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

const transactionSlice = createSlice({
  name: "jobOffer",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addMatcher(
        transactionApi.endpoints.fetchJobOffers.matchPending,
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

export default transactionSlice.reducer;
