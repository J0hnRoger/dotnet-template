using DotnetTemplate.Application.BudgetManagement.CreateTransaction;
using DotnetTemplate.Application.Common.Database;
using DotnetTemplate.Application.Common.Messaging;
using DotnetTemplate.Domain.BudgetManagement;

namespace DotnetTemplate.Application.BudgetManagement.GetAllTransactions;

public record GetAllTransactionsQuery() : ICommand<List<Transaction>>;

internal sealed class GetAllTransactionsQueryHandler(ITransactionRepository transactionRepository, 
    IUnitOfWork unitOfWork) : ICommandHandler<GetAllTransactionsQuery, List<Transaction>>
{
    public async Task<Result<List<Transaction>>> Handle(
        GetAllTransactionsQuery query,
        CancellationToken cancellationToken)
    {
        var allTransactions = await transactionRepository.GetTransactions(cancellationToken);
        return Result.Success(allTransactions);
    }
}
