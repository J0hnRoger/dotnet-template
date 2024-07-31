namespace DotnetTemplate.Web.Api.Extensions;

public static class MiddlewareExtensions
{
    public static IApplicationBuilder UseRequestContextLogging(this IApplicationBuilder app)
    {
        // app.UseMiddleware<Whatever>();
        return app;
    }
}
