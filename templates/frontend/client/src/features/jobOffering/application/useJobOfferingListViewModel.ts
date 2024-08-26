// src/features/JobOffer/Application/viewmodels/JobOfferingListViewModel.ts
import { useFetchJobOffersQuery } from "../infrastructure/jobOfferApi";

export const useJobOfferingListViewModel = () => {
  const { data: jobOfferings, isLoading, error } = useFetchJobOffersQuery({});
  return {
    jobOfferings,
    loading: isLoading,
    error,
  };
};
