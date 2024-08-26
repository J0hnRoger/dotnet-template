// src/features/JobOffer/Application/viewmodels/JobOfferingListViewModel.ts
import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../../../hooks/hooks";

import { useFetchJobOffersQuery } from "../infrastructure/jobOfferApi";

export const useJobOfferingListViewModel = () => {
  const dispatch = useAppDispatch();
  const { data: jobOfferings, isLoading, error } = useFetchJobOffersQuery({});

  return {
    jobOfferings,
    loading: isLoading,
    error,
  };
};
