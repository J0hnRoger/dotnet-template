using DotnetTemplate.Application.BudgetManagement.CreateTransaction;
using DotnetTemplate.Application.Common.Caching;
using DotnetTemplate.Application.Common.Database;
using DotnetTemplate.Application.Common.Messaging;
using DotnetTemplate.Domain.BudgetManagement;

namespace DotnetTemplate.Application.BudgetManagement.GetAllTransactions;

public record GetAllTransactionsQuery() : ICachedQuery<List<Transaction>>
{
    public string CacheKey => $"get-all-transactions";
    public TimeSpan? Expiration => null;
};

internal sealed class GetAllTransactionsQueryHandler(ITransactionRepository transactionRepository, 
    IUnitOfWork unitOfWork) : IQueryHandler<GetAllTransactionsQuery, List<Transaction>>
{
    public async Task<Result<List<Transaction>>> Handle(
        GetAllTransactionsQuery query,
        CancellationToken cancellationToken)
    {
        var allTransactions = await transactionRepository.GetTransactions(cancellationToken);
        return Result.Success(allTransactions);
    }
}
