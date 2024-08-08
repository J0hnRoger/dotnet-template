using System.Data;
using System.Reflection;
using DotnetTemplate.Application.Common.Database;

#if (UseSample)
using DotnetTemplate.Domain.BudgetManagement;
#endif

using Microsoft.EntityFrameworkCore;

namespace DotnetTemplate.Infrastructure.Database;

public sealed class ApplicationDbContext(DbContextOptions<ApplicationDbContext> options)
    : DbContext(options), IUnitOfWork
{
    #if (UseSample)
    public DbSet<Transaction> Transactions => Set<Transaction>();
    public DbSet<Category> Categories => Set<Category>();
    #endif
    
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
