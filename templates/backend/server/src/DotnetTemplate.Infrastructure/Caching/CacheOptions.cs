using Microsoft.Extensions.Caching.Distributed;
using Microsoft.Extensions.Caching.Memory;

namespace DotnetTemplate.Infrastructure.Caching;

public static class CacheOptions
{
    public static MemoryCacheEntryOptions CreateMemoryCacheOptions(TimeSpan? expiration) =>
        expiration is not null
            ? new MemoryCacheEntryOptions() { AbsoluteExpirationRelativeToNow = expiration}
            : new MemoryCacheEntryOptions()
            {
                AbsoluteExpirationRelativeToNow   = TimeSpan.FromMinutes(2)
            };

    public static DistributedCacheEntryOptions DefaultExpiration => new()
    {
        AbsoluteExpirationRelativeToNow = TimeSpan.FromMinutes(2)
    };

    public static DistributedCacheEntryOptions Create(TimeSpan? expiration) =>
        expiration is not null
            ? new DistributedCacheEntryOptions {AbsoluteExpirationRelativeToNow = expiration}
            : DefaultExpiration;
}