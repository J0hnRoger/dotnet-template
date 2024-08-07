using Asp.Versioning;
using Asp.Versioning.Builder;
using DotnetTemplate.Api;
using DotnetTemplate.Api.Extensions;
using DotnetTemplate.Application;
using DotnetTemplate.Infrastructure;
using DotnetTemplate.Infrastructure.Identity;

var builder = WebApplication.CreateBuilder(args);

// Init Configuration
builder.Services.AddKeyVaultIfConfigured(builder.Configuration);

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

#if (UserAuthentication)
app.MapIdentityApi<ApplicationUser>();
#endif

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();

    await app.ApplyMigrations();
}

app.UseHttpsRedirection();

#if (UserAuthentication)
app.UsePermissions();
#endif

app.UseSwaggerWithUi();

app.UseExceptionHandler();

app.Run();

public partial class Program;