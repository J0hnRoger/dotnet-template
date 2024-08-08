using DotnetTemplate.Domain.Common;

namespace DotnetTemplate.Domain.BudgetManagement;

public class Category : Entity
{
    public string Name { get; set; }
    public List<Transaction> Transactions { get; set; }
}