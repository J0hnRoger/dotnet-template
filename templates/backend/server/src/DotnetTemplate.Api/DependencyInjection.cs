using System.Reflection;
using Asp.Versioning;
using Azure.Identity;
using DotnetTemplate.Api.Common;
using DotnetTemplate.Api.Extensions;
using DotnetTemplate.Api.Middlewares;
using DotnetTemplate.Api.OpenApi;
using DotnetTemplate.Application.Common.Authentication;
using DotnetTemplate.Infrastructure.Database;
using Microsoft.OpenApi.Models;

namespace DotnetTemplate.Api;

public static class WebDependencyInjection
{
    public static IServiceCollection AddWebApiServices(this IServiceCollection services,
        ConfigurationManager configuration)
    {
        services.AddScoped<ICurrentUser, CurrentUser>();

        services.AddHttpContextAccessor();

        services.AddHealthChecks()
            .AddDbContextCheck<ApplicationDbContext>();

        services.AddEndpointsApiExplorer();

        services.AddSwaggerGen(opt =>
        {
#if (UseAuthentication)
            opt.AddSecurityDefinition("Bearer",
                new OpenApiSecurityScheme
                {
                    Name = "Authorization",
                    Type = SecuritySchemeType.ApiKey,
                    Scheme = "Bearer",
                    BearerFormat = "JWT",
                    In = ParameterLocation.Header,
                    Description = "Renseignez un Bearer: Bearer {your JWT token}."
                });
#endif
        });

#if (UseAuthentication)
        services.AddPermissions(configuration);
#endif

#if (AppAuthentication)
        services.AddEntraAppAuthentication(configuration);
#endif

        // Si besoin de controllers / Razor:
        // services.AddControllers();
        // services.AddRazor();

        services.AddExceptionHandler<GlobalExceptionHandler>();
        services.AddProblemDetails();

        services.AddEndpoints(Assembly.GetExecutingAssembly());

        services.AddApiVersioning(options =>
            {
                options.DefaultApiVersion = ApiVersion.Default;
                options.AssumeDefaultVersionWhenUnspecified = true;
                options.ApiVersionReader = ApiVersionReader.Combine(new QueryStringApiVersionReader("X-VERSION"),
                    new HeaderApiVersionReader("X-VERSION"));

                options.ReportApiVersions = true;
            })
            .AddApiExplorer(options =>
            {
                options.GroupNameFormat = "'v'V";
                options.SubstituteApiVersionInUrl = false;
            });

        services.ConfigureOptions<ConfigureSwaggerGenOptions>();

        return services;
    }
}