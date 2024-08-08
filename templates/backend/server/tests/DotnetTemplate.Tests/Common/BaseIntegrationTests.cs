using Bogus;
using DotnetTemplate.Infrastructure.Database;
using MediatR;
using Microsoft.Extensions.DependencyInjection;

namespace DotnetTemplate.Tests.Common;

public abstract class BaseIntegrationTests : IClassFixture<IntegrationTestWebAppFactory>, IDisposable
{
    private readonly IServiceScope _scope;

    protected BaseIntegrationTests(IntegrationTestWebAppFactory factory)
    {
        _scope = factory.Services.CreateScope();
        Sender = _scope.ServiceProvider.GetRequiredService<ISender>();
        DbContext = _scope.ServiceProvider.GetRequiredService<ApplicationDbContext>();
        Faker = new Faker();
    }

    protected ISender Sender { get; }

    protected ApplicationDbContext DbContext { get; }

    protected Faker Faker { get; }

    public void Dispose()
    {
        _scope.Dispose();
    }
}