import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { TransactionDto } from '../application/types/budgetTypes'

interface TransactionStore {
  transactions: TransactionDto[]
  loading: boolean
  error: Error | null
  fetchTransactions: () => Promise<void>
  createTransaction: (transaction: Partial<TransactionDto>) => Promise<void>
  updateTransaction: (transaction: Partial<TransactionDto>) => Promise<void>
}

export const useTransactionStore = create(persist<TransactionStore>((set) => ({
  transactions: [],
  loading: false,
  error: null,

  fetchTransactions: async () => {
    set({ loading: true, error: null })
    try {
      const response = await fetch(`${import.meta.env.VITE_APP_SERVER_URL}/api/transactions`)
      const data = await response.json()
      set({ transactions: data, loading: false })
    } catch (error) {
      set({ error: error as Error, loading: false })
    }
  },

  createTransaction: async (transaction) => {
    set({ loading: true, error: null })
    try {
      const response = await fetch(`${import.meta.env.VITE_APP_SERVER_URL}/api/transactions`, {
        method: 'POST',
        body: JSON.stringify(transaction),
        headers: { 'Content-Type': 'application/json' }
      })
      const newTransaction = await response.json()
      set((state) => ({
        transactions: [...state.transactions, newTransaction],
        loading: false
      }))
    } catch (error) {
      set({ error: error as Error, loading: false })
    }
  },

  updateTransaction: async (transaction) => {
    set({ loading: true, error: null })
    try {
      const response = await fetch(`${import.meta.env.VITE_APP_SERVER_URL}/api/transactions/${transaction.id}`, {
        method: 'PUT',
        body: JSON.stringify(transaction),
        headers: { 'Content-Type': 'application/json' }
      })
      const updatedTransaction = await response.json()
      set((state) => ({
        transactions: state.transactions.map(t => 
          t.id === updatedTransaction.id ? updatedTransaction : t
        ),
        loading: false
      }))
    } catch (error) {
      set({ error: error as Error, loading: false })
    }
  }
}), { name: "transaction-store" })) 
