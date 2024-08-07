using System.Reflection;
using DotnetTemplate.Application.Common;
using Microsoft.EntityFrameworkCore;

namespace DotnetTemplate.Infrastructure.Database;

public sealed class ApplicationDbContext(DbContextOptions<ApplicationDbContext> options)
    : DbContext(options), IUnitOfWork
{

    // public DbSet<TodoList> TodoLists => Set<>();

    protected override void OnModelCreating(ModelBuilder builder)
    {
        base.OnModelCreating(builder);
        builder.ApplyConfigurationsFromAssembly(Assembly.GetExecutingAssembly());
    }
}
