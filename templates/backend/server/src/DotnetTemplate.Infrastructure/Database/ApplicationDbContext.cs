using System.Data;
using System.Reflection;
using DotnetTemplate.Application.Common.Database;
using DotnetTemplate.Domain.BudgetManagement;
using Microsoft.EntityFrameworkCore;

namespace DotnetTemplate.Infrastructure.Database;

public sealed class ApplicationDbContext(DbContextOptions<ApplicationDbContext> options)
    : DbContext(options), IUnitOfWork
{
    public DbSet<Transaction> Transactions => Set<Transaction>();
    public DbSet<Category> Categories => Set<Category>();
    protected override void OnModelCreating(ModelBuilder builder)
    {
        base.OnModelCreating(builder);
        
        builder.ApplyConfigurationsFromAssembly(Assembly.GetExecutingAssembly());
    }

    public Task<IDbTransaction> BeginTransactionAsync()
    {
        throw new NotImplementedException();
    }
}
