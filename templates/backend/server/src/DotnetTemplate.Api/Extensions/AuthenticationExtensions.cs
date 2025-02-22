using Microsoft.AspNetCore.Identity;

namespace DotnetTemplate.Api.Extensions;

public static class AuthorizationExtensions
{
    public static IServiceCollection AddBaseAuthentication(this IServiceCollection services,
        ConfigurationManager builderConfiguration)
    {
        // Identity
        services.AddAuthentication(options =>
            {
                options.DefaultAuthenticateScheme = IdentityConstants.ApplicationScheme;
                options.DefaultChallengeScheme = "AzureAD"; // IdentityConstants.ApplicationScheme; 
                options.DefaultSignInScheme = IdentityConstants.ApplicationScheme;
                options.DefaultSignOutScheme = IdentityConstants.ApplicationScheme;
            })
            .AddCookie(IdentityConstants.ApplicationScheme)
            .AddBearerToken(IdentityConstants.BearerScheme);

        return services;
    }

    public static IApplicationBuilder UsePermissions(this IApplicationBuilder app)
    {
        app.UseAuthentication();
        app.UseAuthorization();

        return app;
    }
}
