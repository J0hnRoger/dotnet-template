using DotnetTemplate.Infrastructure.Database;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;

namespace DotnetTemplate.Infrastructure.Identity;

public static class IdentityContextInitializerExtensions
{
    public static async Task SeedIdentityDatabaseAsync(this IApplicationBuilder app)
    {
        using var scope = app.ApplicationServices.CreateScope();

        var initializer = scope.ServiceProvider.GetRequiredService<IdentityContextInitializer>();

        await initializer.SeedAsync();
    }
}

public class IdentityContextInitializer
{
    private readonly ILogger<IdentityContextInitializer> _logger;
    private readonly UserManager<ApplicationUser> _userManager;

    public IdentityContextInitializer(ILogger<IdentityContextInitializer> logger,
        UserManager<ApplicationUser> userManager)
    {
        _logger = logger;
        _userManager = userManager;
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

    public async Task TrySeedAsync()
    {
        // Default users
        var administrator =
            new ApplicationUser {UserName = "administrator@localhost", Email = "administrator@localhost"};

        if (_userManager.Users.All(u => u.UserName != administrator.UserName))
        {
            await _userManager.CreateAsync(administrator, "Administrator1!");
        }
    }
}