using Microsoft.AspNetCore.Diagnostics;
using Microsoft.AspNetCore.Mvc;

namespace DotnetTemplate.Api.Middlewares;

public class GlobalExceptionHandler : IExceptionHandler
{
    private readonly ILogger<GlobalExceptionHandler> _logger;

    public GlobalExceptionHandler(ILogger<GlobalExceptionHandler> logger)
    {
        _logger = logger;
    }

    public async ValueTask<bool> TryHandleAsync(HttpContext context, Exception exception,
        CancellationToken cancellationToken)
    {
        var guid = Guid.NewGuid();
        
        _logger.LogError(exception, "Error occured in API: Id: {ErrorId} - {Message} ", guid.ToString(),
            exception.Message);
        
        var problemDetails = new ProblemDetails()
        {
            Status = StatusCodes.Status500InternalServerError,
            Type = "https://datatracker.ietf.org/doc/html/rfc7231#section-6.6.1",
            Title = "Server Error",
            Extensions = new Dictionary<string, object?>() { { "ErrorId", guid.ToString() }}
        };

        context.Response.StatusCode = StatusCodes.Status500InternalServerError;
        
        await context.Response.WriteAsJsonAsync(problemDetails, cancellationToken: cancellationToken);

        return true;
    }
}