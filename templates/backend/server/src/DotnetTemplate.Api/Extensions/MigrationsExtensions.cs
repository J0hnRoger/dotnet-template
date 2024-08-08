using DotnetTemplate.Infrastructure.Database;
using DotnetTemplate.Infrastructure.Identity;
using Microsoft.EntityFrameworkCore;
using DotnetTemplate.Infrastructure;

namespace DotnetTemplate.Api.Extensions;

public static class MigrationExtensions
{
    public static async Task ApplyMigrations(this IApplicationBuilder app)
    {
        using IServiceScope scope = app.ApplicationServices.CreateScope();

        using ApplicationDbContext dbContext =
            scope.ServiceProvider.GetRequiredService<ApplicationDbContext>();

        await dbContext.Database.MigrateAsync();

        await app.SeedDatabaseAsync();

#if(UserAuthentication)
        using IdentityContext identityContext =
            scope.ServiceProvider.GetRequiredService<IdentityContext>();

        await identityContext.Database.MigrateAsync();

        await app.SeedIdentityDatabaseAsync();
#endif
    }
}