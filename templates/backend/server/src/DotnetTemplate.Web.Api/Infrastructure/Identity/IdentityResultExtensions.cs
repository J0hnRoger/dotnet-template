namespace DotnetTemplate.Web.Api.Infrastructure.Identity;
using Microsoft.AspNetCore.Identity;

public static class IdentityResultExtensions
{
    public static Result ToApplicationResult(this IdentityResult result)
    {
        return result.Succeeded
            ? Result.Success()
            : Result.Failure(string.Join(",", result.Errors.Select(e => e.Description)));
    }
}
