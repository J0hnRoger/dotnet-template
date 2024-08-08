#if (UseSample)
using DotnetTemplate.Domain.BudgetManagement;
#endif
using Microsoft.AspNetCore.Builder;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;

namespace DotnetTemplate.Infrastructure.Database;

public static class DatabaseInitializerExtensions
{
    public static async Task SeedDatabaseAsync(this IApplicationBuilder app)
    {
        using var scope = app.ApplicationServices.CreateScope();

        var initialiser = scope.ServiceProvider.GetRequiredService<ApplicationDbContextInitializer>();

        await initialiser.SeedAsync();
    }
}

public class ApplicationDbContextInitializer
{
    private readonly ILogger<ApplicationDbContextInitializer> _logger;
    private readonly ApplicationDbContext _context;

    public ApplicationDbContextInitializer(ILogger<ApplicationDbContextInitializer> logger, ApplicationDbContext context)
    {
        _logger = logger;
        _context = context;
    }

    public async Task SeedAsync()
    {
        try
        {
            await TrySeedAsync();
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "An error occurred while seeding the database.");
            throw;
        }
    }

    private async Task TrySeedAsync()
    {
        // Default data
        
        #if (UseSample)
        if (!_context.Transactions.Any())
        {
            _context.Transactions.Add(new Transaction()
            {
                Name = "Transaction exemple 1",
                Amount =  -200.56m,
                Created = DateTime.Now.AddDays(-2),
                Category = new Category()
                {
                    Name = "food"
                }
            });
            
            _context.Transactions.Add(new Transaction()
            {
                Name = "Transaction exemple 2",
                Amount =  -56m,
                Created = DateTime.Now.AddDays(-1),
                Category = new Category()
                {
                    Name = "taxes"
                }
            });
        
            await _context.SaveChangesAsync();
        }
        #endif
    }
}
