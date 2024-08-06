using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.Identity.Web;

namespace DotnetTemplate.Api.Extensions;

/// <summary>
/// Authentifier l'API via Microsoft Entra
/// - permet de protéger les endpoints de l'API
/// </summary>
public static class AzureAdApplicationExtensions
{
    public static IServiceCollection AddEntraAppAuthentication(this IServiceCollection services,
        IConfiguration configuration)
    {
        services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
            .AddMicrosoftIdentityWebApi(options =>
            {
                configuration.Bind("AzureAd", options);
                options.TokenValidationParameters.NameClaimType = "name";
            }, options => { configuration.Bind("AzureAd", options); });

        services.AddAuthorization(config =>
        {
            config.AddPolicy("AuthZPolicy", policyBuilder =>
                policyBuilder.Requirements.Add(
                    new ScopeAuthorizationRequirement() {RequiredScopesConfigurationKey = $"AzureAd:Scopes"}));
        });
        return services;
    }
}