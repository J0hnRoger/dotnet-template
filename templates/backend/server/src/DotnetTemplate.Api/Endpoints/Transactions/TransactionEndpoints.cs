using System.Security.Claims;
using DotnetTemplate.Application.BudgetManagement.GetAllTransactions;
using DotnetTemplate.Domain.BudgetManagement;
using MediatR;
using IResult = Microsoft.AspNetCore.Http.IResult;

namespace DotnetTemplate.Api.Endpoints.Transactions;

public class TransactionEndpoints : IEndpoint
{
    protected RouteGroupBuilder _group;  
    
    public void MapEndpoints(IEndpointRouteBuilder app)
    {
        _group = app.MapGroup("transactions")
            #if (UseAuthentication)
            .RequireAuthorization()
            #endif
            .RequireRateLimiting("fixed")
            .WithOpenApi()
            .WithTags(Tags.Transactions);

        _group.MapGet("", GetAllTransactions)
            .HasApiVersion(1)
            .WithName("GetAllTransactions");
    }

    public async Task<IResult> GetAllTransactions(HttpContext context, ClaimsPrincipal user, 
        ISender sender,
        ILogger<TransactionEndpoints> logger, CancellationToken cancellationToken)
    {
        logger.LogInformation("{UserName} use endpoint {Endpoint}", user.Identity!.Name, "GetAllTransactions");
        var query = new GetAllTransactionsQuery();

        Result<GetAllTransactionResponse> result = await sender.Send(query, cancellationToken);
        
        if (result.IsFailure)
        {
            logger.LogError(result.Error);
            return Results.Problem();
        }

        return Results.Ok(result.Value);
    }
}