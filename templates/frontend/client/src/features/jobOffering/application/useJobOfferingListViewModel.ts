// src/features/JobOffer/Application/viewmodels/JobOfferingListViewModel.ts
import { useEffect } from "react";
import { fetchJobOffers } from "../application/jobOfferActions";
import { useAppDispatch, useAppSelector } from "../../../hooks/hooks";

export const useJobOfferingListViewModel = () => {
  const dispatch = useAppDispatch();
  const { jobOfferings, loading, error } = useAppSelector(
    (state) => state.jobOffer
  );

  useEffect(() => {
    dispatch(fetchJobOffers());
  }, [dispatch]);

  return {
    jobOfferings,
    loading,
    error,
  };
};
