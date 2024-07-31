import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { JobOfferDto } from "../application/types/jobOfferTypes";

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
    createJobOffer: builder.mutation<JobOfferDto, Partial<JobOfferDto>>({
      query: (jobOfferDto) => ({
        url: `/joboffers`,
        method: "POST",
        body: jobOfferDto,
      }),
    }),
    updateJobOffer: builder.mutation<JobOfferDto, Partial<JobOfferDto>>({
      query: (jobOfferDto) => ({
        url: `/joboffers/${jobOfferDto.id}`,
        method: "PUT",
        body: jobOfferDto,
      }),
    }),
  }),
});

export const {
  useFetchJobOffersQuery,
  useCreateJobOfferMutation,
  useUpdateJobOfferMutation,
} = jobOfferApi;
