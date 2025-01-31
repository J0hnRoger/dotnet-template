import { create } from 'zustand'
import { transactionApi } from './transactionApi'
import { TransactionDto } from '../application/types/budgetTypes'

interface TransactionStore {
  transactions: TransactionDto[]
  loading: boolean
  error: Error | null
  fetchTransactions: () => Promise<void>
  createTransaction: (transaction: Partial<TransactionDto>) => Promise<void>
  updateTransaction: (transaction: Partial<TransactionDto>) => Promise<void>
}

export const useTransactionStore = create<TransactionStore>((set) => ({
  transactions: [],
  loading: false,
  error: null,

  fetchTransactions: async () => {
    set({ loading: true, error: null })
    try {
      const data = await transactionApi.fetchTransactions()
      set({ transactions: data, loading: false })
    } catch (error) {
      set({ error: error as Error, loading: false })
    }
  },

  createTransaction: async (transaction) => {
    set({ loading: true, error: null })
    try {
      const newTransaction = await transactionApi.createTransaction(transaction)
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
      const updatedTransaction = await transactionApi.updateTransaction(transaction)
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
})) 
