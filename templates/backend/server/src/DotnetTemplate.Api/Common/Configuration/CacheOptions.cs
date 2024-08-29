using System.ComponentModel.DataAnnotations;

namespace DotnetTemplate.Api.Common.Configuration;

public class CacheOptions
{
    [Range(1, 10000, ErrorMessage = "Value for {0} must be between {1} and {2}.")]
    public double ExpirationTimeInMinutes { get; set; } = 120;
}