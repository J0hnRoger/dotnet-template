using DotnetTemplate.Application.Common.Database;
using DotnetTemplate.Application.Common.Messaging;
using DotnetTemplate.Domain.BudgetManagement;

namespace DotnetTemplate.Application.BudgetManagement.CreateTransaction;

// DTO for API Endpoint
public record CreateTransactionRequest(string Name, decimal Amount, DateTime Created);

public record CreateTransactionCommand(string Name, decimal Amount, DateTime Created)
    : ICommand<Guid>;

internal sealed class CreateTransactionCommandHandler(ITransactionRepository transactionRepository, 
    IUnitOfWork unitOfWork) : ICommandHandler<CreateTransactionCommand, Guid>
{
    public async Task<Result<Guid>> Handle(
        CreateTransactionCommand command,
        CancellationToken cancellationToken)
    {
        var transaction = new Transaction();
        
        transactionRepository.Insert(transaction);
        
        await unitOfWork.SaveChangesAsync(cancellationToken);

        return transaction.Id;
    }
}
