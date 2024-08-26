import { useTransactionListViewModel } from '@/features/budget/application/useTransactionListViewModel';

const TransactionList = () => {
    const { transactions, loading, error } = useTransactionListViewModel()

    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error: {error.toString()}</div>;

    return (
        <div>
            {transactions.map((transaction) => (
                <div key={transaction.id}>{transaction.name}</div>
            ))}
        </div>
    );
};

export default TransactionList;
