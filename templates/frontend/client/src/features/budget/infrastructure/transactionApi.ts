import { TransactionDto } from "../application/types/budgetTypes";

const BASE_URL = `/api`

export const transactionApi = {
  fetchTransactions: async () => {
    const response = await fetch(`${BASE_URL}/transactions`)
    if (!response.ok) throw new Error('Failed to fetch transactions')
    return response.json()
  },

  createTransaction: async (transaction: Partial<TransactionDto>) => {
    const response = await fetch(`${BASE_URL}/transactions`, {
      method: 'POST',
      body: JSON.stringify(transaction),
      headers: { 'Content-Type': 'application/json' }
    })
    if (!response.ok) throw new Error('Failed to create transaction')
    return response.json()
  },

  updateTransaction: async (transaction: Partial<TransactionDto>) => {
    const response = await fetch(`${BASE_URL}/transactions/${transaction.id}`, {
      method: 'PUT',
      body: JSON.stringify(transaction),
      headers: { 'Content-Type': 'application/json' }
    })
    if (!response.ok) throw new Error('Failed to update transaction')
    return response.json()
  }
}

export const {
  fetchTransactions,
  createTransaction,
  updateTransaction,
} = transactionApi;
