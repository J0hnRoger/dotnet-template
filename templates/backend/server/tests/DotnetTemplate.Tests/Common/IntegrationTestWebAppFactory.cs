using DotnetTemplate.Infrastructure.Database;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Mvc.Testing;
using Microsoft.AspNetCore.TestHost;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.DependencyInjection.Extensions;

namespace DotnetTemplate.Tests.Common;

public class IntegrationTestWebAppFactory : WebApplicationFactory<Program>, IAsyncLifetime
{
    protected override void ConfigureWebHost(IWebHostBuilder builder)
    {
        builder.ConfigureTestServices(services =>
        {
            string testConnection = TestConfiguration.GetDbConnectionString("TestConnection");
            services.RemoveAll(typeof(ApplicationDbContext));
            
            services.AddDbContext<ApplicationDbContext>(options => 
                options.UseSqlite(testConnection));
        });
    }

    // Called once before each tests
    public Task InitializeAsync()
    {
        return Task.CompletedTask;
    }

    // Called once after each tests
    public Task DisposeAsync()
    {
        return Task.CompletedTask;
    }
}