using System.Reflection;
using Asp.Versioning;
using Asp.Versioning.Builder;
using DotnetTemplate.Web.Api.Extensions;
using DotnetTemplate.Web.Api.Health;
using DotnetTemplate.Web.Api.Infrastructure;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddHealthChecks()
    .AddCheck<DeliveryDatabaseHealthCheck>("Delivery Database");

// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

builder.Services.AddHttpContextAccessor();

builder.Services.AddPermissions();

builder.Services.AddEndpoints(Assembly.GetExecutingAssembly());

builder.Services.AddExceptionHandler<GlobalExceptionHandler>();
builder.Services.AddProblemDetails();

builder.Services.AddApiVersioning(options =>
{
    options.DefaultApiVersion = new ApiVersion(1);
    options.ApiVersionReader = new UrlSegmentApiVersionReader();
}).AddApiExplorer(options =>
{
    options.GroupNameFormat = "'v'V";
    options.SubstituteApiVersionInUrl = true;
});

var app = builder.Build();

app.MapHealthChecks("/_health");

ApiVersionSet apiVersionSet = app.NewApiVersionSet()
    .HasApiVersion(new ApiVersion(1))
    .ReportApiVersions()
    .Build();

RouteGroupBuilder versionedGroup = app
    .MapGroup("api/v{version:apiVersion}")
    .WithApiVersionSet(apiVersionSet);

app.MapEndpoints(versionedGroup);
// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();
app.UseSwaggerWithUi();

app.UseExceptionHandler();
app.UseAuthentication();

app.UseAuthorization();
app.UseAuthentication();

app.Run();

public partial class Program;
