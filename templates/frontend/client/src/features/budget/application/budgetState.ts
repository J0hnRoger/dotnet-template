import { SerializedError, createSlice } from "@reduxjs/toolkit";
import { transactionApi } from "../infrastructure/transactionApi";
import { JobOfferDto } from "@/features/jobOffering/application/types/jobOfferTypes";

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
        transactionApi.endpoints.fetchTransactions.matchPending,
        (state) => {
          state.loading = true;
          state.error = null;
        }
      )
      .addMatcher(
        transactionApi.endpoints.fetchTransactions.matchFulfilled,
        (state, action) => {
          state.loading = false;
          state.jobOffers = action.payload;
        }
      )
      .addMatcher(
        transactionApi.endpoints.fetchTransactions.matchRejected,
        (state, action) => {
          state.loading = false;
          state.error = action.error;
        }
      );
  },
});

export default transactionSlice.reducer;
