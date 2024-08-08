using DotnetTemplate.Domain.BudgetManagement;
using FluentValidation;

namespace DotnetTemplate.Application.BudgetManagement.CreateTransaction;

internal sealed class CreateTransactionCommandValidator : AbstractValidator<CreateTransactionCommand>
{
    private readonly ITransactionRepository _transactionRepository;

    public CreateTransactionCommandValidator(ITransactionRepository transactionRepository)
    {
        this._transactionRepository = transactionRepository;

        RuleFor(v => v.Name)
            .NotEmpty()
            .MaximumLength(250);
    }
}
