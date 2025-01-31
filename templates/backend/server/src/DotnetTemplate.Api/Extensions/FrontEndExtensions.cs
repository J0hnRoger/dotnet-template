using Microsoft.Extensions.FileProviders;

namespace DotnetTemplate.Api.Extensions;

using Microsoft.AspNetCore.Builder;

public static class FrontendExtensions
{
    public static void AddFrontend(this WebApplication app)
    {
        var frontendDistPath = Path.Combine(Directory.GetCurrentDirectory(), "wwwroot");

        if (Directory.Exists(frontendDistPath))
        {
            app.UseStaticFiles(new StaticFileOptions
            {
                FileProvider = new PhysicalFileProvider(frontendDistPath), RequestPath = ""
            });
        }
    }
}