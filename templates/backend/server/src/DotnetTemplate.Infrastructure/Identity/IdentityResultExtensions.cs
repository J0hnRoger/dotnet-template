using DotnetTemplate.Domain.Common;
using Microsoft.AspNetCore.Identity;

namespace DotnetTemplate.Infrastructure.Identity;

public static class IdentityResultExtensions
{
    public static Result ToApplicationResult(this IdentityResult result)
    {
        return result.Succeeded
            ? Result.Success()
            : Result.Failure(new Error("identity.errors", string.Join(", ", result.Errors.Select(e => e.Description)), ErrorType.Validation));
    }
}
