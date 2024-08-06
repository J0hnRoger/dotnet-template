using Microsoft.AspNetCore.Mvc;
using IResult = Microsoft.AspNetCore.Http.IResult;

namespace DotnetTemplate.Api.Endpoints.WeatherForecast;

public class WeatherForecastEndpoints : IEndpoint
{
    static readonly string[] _summaries = new[]
    {
        "Freezing", "Bracing", "Chilly", "Cool", "Mild", "Warm", "Balmy", "Hot", "Sweltering", "Scorching"
    };

    static readonly string[] _validLocations = new[] {"France", "Spain", "Italia", "UK", "US"};

    public void MapEndpoints(IEndpointRouteBuilder app)
    {
        var group = app.MapGroup("weatherforecast")
            .RequireRateLimiting("fixed")
            .WithOpenApi()
            .WithTags(Tags.WeatherForecast);

        group.MapGet("", GetWeatherForecast)
            .WithName("GetWeatherForecast");
    }

    public static async Task<IResult> GetWeatherForecast([FromQuery] string location, HttpContext context,
        ILogger<WeatherForecast> logger)
    {
        logger.LogInformation("Endpoint hit: {Endpoint}", context.Request.Path);
        if (!_validLocations.Contains(location))
        {
            return Results.Problem(
                statusCode: StatusCodes.Status400BadRequest,
                title: "Invalid Location. ",
                detail: "Valid location: /api/weatherforecast/locations",
                type: "https://www.rfc-editor.org/rfc/rfc7231#section-6.5.1",
                extensions: new Dictionary<string, object?>() {
                    {"errors", new []{ "" }} }
            );
        }

        var forecast = Enumerable.Range(1, 5).Select(index =>
                new WeatherForecast
                (
                    DateOnly.FromDateTime(DateTime.Now.AddDays(index)),
                    Random.Shared.Next(-20, 55),
                    _summaries[Random.Shared.Next(_summaries.Length)]
                ))
            .ToArray();

        if (!forecast.Any())
            return TypedResults.NotFound("nobody here");

        return TypedResults.Ok(forecast);
    }
}