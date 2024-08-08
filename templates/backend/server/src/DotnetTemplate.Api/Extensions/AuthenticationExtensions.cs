using Microsoft.AspNetCore.Identity;

namespace DotnetTemplate.Api.Extensions;

public static class AuthorizationExtensions
{
    public static IServiceCollection AddPermissions(this IServiceCollection services, ConfigurationManager builderConfiguration)
    {
        // Identity
        services.AddAuthentication()
            .AddBearerToken(IdentityConstants.BearerScheme);
        
        services.AddAuthorizationBuilder();
       
        return services;
    }
}