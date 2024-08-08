namespace DotnetTemplate.Domain.BudgetManagement;

public interface ITransactionRepository
{
    Task<List<Transaction>> GetTransactions(CancellationToken cancellationToken = default);
    
    Task<Transaction?> GetByIdAsync(Guid id, CancellationToken cancellationToken = default);
    
    void Insert(Transaction user);
}