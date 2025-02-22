namespace DotnetTemplate.Api.Extensions;

public static class AuthCookieExtensions
{
    /// <summary>
    /// Gère les comportements de redirection lors de l'accès à une zone sécurisée Front vs. API.
    /// </summary>
    public static IServiceCollection ConfigureApplicationCookieForApis(
        this IServiceCollection services)
    {
        services.ConfigureApplicationCookie(options =>
        {
            options.Events.OnRedirectToLogin = context =>
            {
                // Si la requête est destinée à une API, on renvoie 401
                if (context.Request.Path.StartsWithSegments("/api"))
                {
                    context.Response.StatusCode = StatusCodes.Status401Unauthorized;
                    return Task.CompletedTask;
                }

                // Sinon, comportement par défaut
                context.Response.Redirect(context.RedirectUri);
                return Task.CompletedTask;
            };

            options.Events.OnRedirectToAccessDenied = context =>
            {
                if (context.Request.Path.StartsWithSegments("/api"))
                {
                    context.Response.StatusCode = StatusCodes.Status403Forbidden;
                    return Task.CompletedTask;
                }

                context.Response.Redirect(context.RedirectUri);
                return Task.CompletedTask;
            };
        });

        return services;
    }
}
