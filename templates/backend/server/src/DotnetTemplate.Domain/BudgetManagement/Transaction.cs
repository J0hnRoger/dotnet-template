using DotnetTemplate.Domain.Common;

namespace DotnetTemplate.Domain.BudgetManagement;

public class Transaction : Entity
{
    public string Name { get; set; }
    public decimal Amount { get; set; }
    public DateTime Created { get; set; }
    public Category Category { get; set; }
    public Guid CategoryId { get; set; }
}