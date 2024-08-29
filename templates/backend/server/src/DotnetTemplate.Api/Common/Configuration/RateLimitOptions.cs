using System.Threading.RateLimiting;

namespace DotnetTemplate.Api.Common.Configuration;

public class RateLimitOptions
{
    public int PermitLimit { get; set; } = 3;
    public int WindowSeconds { get; set; } = 10;
    public int QueueLimit { get; set; } = 3;

    public static RateLimitOptions CreateDefault()
    {
        return new RateLimitOptions();
    }
}