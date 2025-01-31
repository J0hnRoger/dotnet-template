import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { TransactionDto } from "../application/types/budgetTypes";

export const transactionApi = createApi({
  reducerPath: "transactionApi",
  baseQuery: fetchBaseQuery({ baseUrl: "/api" }),
  endpoints: (builder) => ({
    fetchTransactions: builder.query({
      query: (params) => ({
        url: "transactions",
        params,
      }),
    }),
    createTransaction: builder.mutation<TransactionDto, Partial<TransactionDto>>({
      query: (transactionDto) => ({
        url: `transactions`,
        method: "POST",
        body: transactionDto,
      }),
    }),
    updateTransaction: builder.mutation<TransactionDto, Partial<TransactionDto>>({
      query: (transactionDto) => ({
        url: `transactions/${transactionDto.id}`,
        method: "PUT",
        body: transactionDto,
      }),
    }),
  }),
});

export const {
  useFetchTransactionsQuery,
  useCreateTransactionMutation,
  useUpdateTransactionMutation,
} = transactionApi;
