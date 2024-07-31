using System.Reflection;
using Microsoft.AspNetCore.Authorization;

namespace DotnetTemplate.Web.Api.Extensions;

public static class AuthorizationExtensions
{
    public static IServiceCollection AddPermissions(this IServiceCollection services)
    {
        services.AddAuthentication() // on le garde vide pour ne spécifier aucune Auth par défaut
            // https://github.com/dotnet/aspnetcore/issues/26002
            .AddJwtBearer(options =>
            {
                options.Authority = builder.Configuration["IdentityUri"];
                options.TokenValidationParameters.ValidateAudience = false;
                options.TokenValidationParameters.ValidateIssuer = !builder.Environment.IsDevelopment();
                options.IncludeErrorDetails = builder.Configuration.GetValue<bool>("ShowIdentityDetails");
            })
            .AddMicrosoftIdentityWebApi(builder.Configuration, jwtBearerScheme: "AzureAd",
                subscribeToJwtBearerMiddlewareDiagnosticsEvents: true);

        services.AddAuthorization(options =>
        {
            options.DefaultPolicy = new AuthorizationPolicyBuilder()
                .RequireAuthenticatedUser()
                .AddAuthenticationSchemes(JwtBearerDefaults.AuthenticationScheme)
                .Build();

            options.AddPolicy("AzureAdPolicy", policy =>
            {
                policy.AuthenticationSchemes.Add("AzureAd");
                policy.RequireAuthenticatedUser();
            });
        });
        return services;
    }
}