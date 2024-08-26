import { useFetchTransactionsQuery } from "../infrastructure/transactionApi";

export const useTransactionListViewModel = () => {
  const result = useFetchTransactionsQuery({});
  return {
    transactions: result.data,
    loading: result.isLoading,
    error: result.error,
  };
};