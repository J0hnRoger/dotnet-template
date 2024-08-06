using DotnetTemplate.Api.Extensions;
using Microsoft.AspNetCore.Mvc;
using IResult = Microsoft.AspNetCore.Http.IResult;

namespace DotnetTemplate.Api.Endpoints.Users;

public class UserEndpoints : IEndpoint
{
    public void MapEndpoints(IEndpointRouteBuilder app)
    {
        var group = app.MapGroup("users")
            .RequireRateLimiting("fixed")
            .WithOpenApi()
            .WithTags(Tags.Users);

        group.MapGet("{userId}", GetUserById)
            .HasPermission(Permissions.UsersAccess)
            .WithName("GetUser");
    }

    public async Task<IResult> GetUserById([FromRoute] string userId, HttpContext context,
        ILogger<UserEndpoints> logger)
    {
        logger.LogInformation("Endpoint hit: {Endpoint}", context.Request.Path);
        if (String.IsNullOrWhiteSpace(userId))
        {
            return Results.Problem(
                statusCode: StatusCodes.Status400BadRequest,
                title: "Invalid Email. ",
                detail: "Email is mandatory: /api/users/{userId}",
                type: "https://www.rfc-editor.org/rfc/rfc7231#section-6.5.1",
                extensions: new Dictionary<string, object?>() {{"errors", new[] {""}}}
            );
        }

        // return TypedResults.NotFound("nobody here");

        return TypedResults.Ok();
    }
}