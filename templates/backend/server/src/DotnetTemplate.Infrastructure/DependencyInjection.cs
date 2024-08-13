using Dapper;
using DotnetTemplate.Application.Common.Caching;
using DotnetTemplate.Application.Common.Database;
using DotnetTemplate.Domain.Common;
using DotnetTemplate.Infrastructure.Caching;
using DotnetTemplate.Infrastructure.Database;
using DotnetTemplate.Infrastructure.Identity;
using DotnetTemplate.Infrastructure.Time;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;

#if (UseSample)
using DotnetTemplate.Infrastructure.Repositories;
using DotnetTemplate.Domain.BudgetManagement;
#endif

namespace DotnetTemplate.Infrastructure;

public static class DependencyInjection
{
    public static IServiceCollection AddInfrastructure(
        this IServiceCollection services,
        IConfiguration configuration) =>
        services
            .AddServices()
            .AddDatabase(configuration)
            .AddCaching(configuration)
#if (UseAuthentication)
            .AddIdentityDatabase(configuration)
#endif
            .AddHealthChecks(configuration);

    private static IServiceCollection AddServices(this IServiceCollection services)
    {
        services.AddSingleton<IDateTimeProvider, DateTimeProvider>();

        return services;
    }

    private static IServiceCollection AddIdentityDatabase(this IServiceCollection services,
        IConfiguration configuration)
    {
        string? connectionString = configuration.GetConnectionString("IdentityConnection");
#if (UseSQLServer)
        services.AddDbContext<IdentityContext<ApplicationUser>>(x => x.UseSqlServer());
#else
        services.AddDbContext<IdentityContext>(x => x.UseSqlite(connectionString));
#endif
        services.AddIdentityCore<ApplicationUser>()
            .AddEntityFrameworkStores<IdentityContext>()
            .AddApiEndpoints();

        services.AddScoped<IdentityContextInitializer>();

        return services;
    }

    private static IServiceCollection AddDatabase(this IServiceCollection services, IConfiguration configuration)
    {
        SqlMapper.AddTypeHandler(new DateOnlyTypeHandler());

        string? connectionString = configuration.GetConnectionString("DefaultConnection");
        Ensure.NotNullOrEmpty(connectionString);

        services.AddSingleton<IDbConnectionFactory>(_ =>
            new DbConnectionFactory(connectionString));

        services.AddDbContext<ApplicationDbContext>(options =>
        {
#if (!UseSQLServer)
            options.UseSqlite(connectionString);
#else
            options.UseSqlServer(connectionString, sqlOptions =>
            {
                sqlOptions.EnableRetryOnFailure();
                sqlOptions.MigrationsHistoryTable(
                    HistoryRepository.DefaultTableName, Schemas.Default);
            });
#endif
        });

        services.AddScoped<ApplicationDbContextInitializer>();

        services.AddScoped<IUnitOfWork>(sp => sp.GetRequiredService<ApplicationDbContext>());

#if (UseSample)
        services.AddScoped<ITransactionRepository, TransactionRepository>();
#endif
        return services;
    }

    private static IServiceCollection AddCaching(this IServiceCollection services, IConfiguration configuration)
    {
        // string redisConnectionString = configuration.GetConnectionString("Cache")!;
        // services.AddStackExchangeRedisCache(options => options.Configuration = redisConnectionString);
        services.AddMemoryCache();

        services.AddSingleton<ICacheService, InMemoryCacheService>();

        return services;
    }

    private static IServiceCollection AddHealthChecks(this IServiceCollection services, IConfiguration configuration)
    {
        services
            .AddHealthChecks()
#if (UseSQLServer)
            .AddSqlServer(configuration.GetConnectionString("DefaultConnection")!)
#endif
#if (UseCache)
        .AddRedis(configuration.GetConnectionString("Cache")!)
#endif
            ;

        return services;
    }
}