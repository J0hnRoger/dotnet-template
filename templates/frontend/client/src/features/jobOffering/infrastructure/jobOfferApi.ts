import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const jobOfferApi = createApi({
  reducerPath: "jobOfferApi",
  baseQuery: fetchBaseQuery({ baseUrl: "https://backend" }),
  endpoints: (builder) => ({
    fetchJobOffers: builder.query({
      query: (params) => ({
        url: "/joboffers",
        params,
      }),
    }),
  }),
});

export const { useFetchJobOffersQuery } = jobOfferApi;
