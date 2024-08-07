using DotnetTemplate.Domain.Common;

namespace DotnetTemplate.Domain.BudgetManagement;

public class Transaction : Entity
{
    public DateTime Created { get; set; }
}