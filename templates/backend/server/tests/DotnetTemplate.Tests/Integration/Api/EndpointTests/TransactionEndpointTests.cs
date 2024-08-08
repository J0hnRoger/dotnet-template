using Bogus;
using CSharpFunctionalExtensions;
using DotnetTemplate.Application.BudgetManagement.CreateTransaction;
using DotnetTemplate.Application.BudgetManagement.GetAllTransactions;
using DotnetTemplate.Domain.BudgetManagement;
using FluentAssertions;

namespace DotnetTemplate.Tests.Integration.Api.EndpointTests;

public class TransactionEndpointTests : BaseIntegrationTests
{
    public TransactionEndpointTests(IntegrationTestWebAppFactory factory)
        : base(factory)
    {
    }

    [Fact]
    public async Task GetTransactions_ReturnAllTransactions()
    {
        var command = new GetAllTransactionsQuery();

        Result<List<Transaction>> result = await Sender.Send(command);

        result.IsSuccess.Should().BeTrue();
        result.Value.Count.Should().BeGreaterThan(0);
    }

    [Fact]
    public async Task CreateTransaction_CreateValidTransaction()
    {
        var amount = Faker.Random.Decimal(-1000m, 1000m);
        var command = new CreateTransactionCommand("Integration test transaction", amount, new DateTime(2024, 08, 08));

        Result<Guid> result = await Sender.Send(command);

        // Assert
        result.IsSuccess.Should().BeTrue();
    }

    [Fact]
    public Task Handle_Should_AddUserToDatabase_WhenCommandIsValid()
    {
        return Task.CompletedTask;
    }
}