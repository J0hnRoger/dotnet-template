using Asp.Versioning;
using Asp.Versioning.Builder;
using DotnetTemplate.Api;
using DotnetTemplate.Api.Extensions;
using DotnetTemplate.Application;
using DotnetTemplate.Infrastructure;

var builder = WebApplication.CreateBuilder(args);

// Init Configuration
builder.Services.AddKeyVaultIfConfigured(builder.Configuration, builder.Environment);

builder.Services.AddOptions();

builder.Services
    .AddWebApiServices(builder.Configuration)
    .AddApplication()
    .AddInfrastructure(builder.Configuration);

var app = builder.Build();

app.MapHealthChecks("/_health");

ApiVersionSet apiVersionSet = app.NewApiVersionSet()
    .HasApiVersion(new ApiVersion(1))
    .HasApiVersion(new ApiVersion(2))
    .ReportApiVersions()
    .Build();

RouteGroupBuilder versionedGroup = app
    .MapGroup("api/")
    .WithApiVersionSet(apiVersionSet);

app.MapEndpoints(versionedGroup);

#if (UseAuthentication)
app.MapIdentityApi<ApplicationUser>();
#endif

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();

    await app.ApplyMigrations();
}

app.UseCors(app.Environment.IsDevelopment() ? "Development" : "Production");

app.UseHttpsRedirection();

#if (UseAuthentication)
app.UsePermissions();
#endif

#if (UseFrontend)
app.AddFrontend();
#endif


if (app.Environment.IsDevelopment())
    app.UseSwaggerWithUi();

app.UseExceptionHandler();

await app.RunAsync();

public partial class Program;