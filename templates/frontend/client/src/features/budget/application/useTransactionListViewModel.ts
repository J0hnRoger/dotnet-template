import { useTransactionStore } from '../infrastructure/transactionStore'
import { useEffect } from 'react'

export const useTransactionListViewModel = () => {
  const { transactions, loading, error, fetchTransactions } = useTransactionStore()

  useEffect(() => {
    fetchTransactions()
  }, [])

  return {
    transactions,
    loading,
    error
  }
}