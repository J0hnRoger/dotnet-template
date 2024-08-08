using DotnetTemplate.Domain.BudgetManagement;
using Microsoft.EntityFrameworkCore;

namespace DotnetTemplate.Infrastructure.Database.Repositories;

public class TransactionRepository(ApplicationDbContext context) : ITransactionRepository
{
    public async Task<List<Transaction>> GetTransactions(CancellationToken cancellationToken = default)
    {
        return await context.Transactions.ToListAsync(cancellationToken: cancellationToken);
    }

    public async Task<Transaction?> GetByIdAsync(Guid id, CancellationToken cancellationToken = default)
    {
        return await context.Transactions.FirstAsync(cancellationToken: cancellationToken);
    }

    public void Insert(Transaction transaction)
    {
        context.Transactions.Add(transaction);
    }
}