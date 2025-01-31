import { createAsyncThunk } from "@reduxjs/toolkit";
import { setLoader } from "../../../core/ui/uiState";
import { setNotification } from "../../../core/notifications/notificationState";

export const fetchJobOffers = createAsyncThunk(
  "jobOffer/fetchJobOffers",
  async (_, { dispatch }) => {
    dispatch(setLoader(true));
    try {
    //      const response = await jobOfferApi.endpoints.fetchJobOffers.initiate({});
    } catch (error) {
      dispatch(setNotification(error.message));
      throw error;
    } finally {
      dispatch(setLoader(false));
    }
  }
);
