﻿using System.Buffers;
using System.Text.Json;
using DotnetTemplate.Application.Common.Caching;
using Microsoft.Extensions.Caching.Distributed;
using Microsoft.Extensions.Caching.Memory;

namespace DotnetTemplate.Infrastructure.Caching;

internal sealed class InMemoryCacheService(IMemoryCache cache) : ICacheService
{
    public Task<T?> GetAsync<T>(string key, CancellationToken cancellationToken = default)
    {
        var cacheValue = cache.Get<T?>(key);
        return Task.FromResult<T?>(default(T));
    }

    public Task SetAsync<T>(
        string key,
        T value,
        TimeSpan? expiration = null,
        CancellationToken cancellationToken = default)
    {
        cache.Set(key, value, CacheOptions.CreateMemoryCacheOptions(expiration));
        return Task.CompletedTask;
    }

    public Task RemoveAsync(string key, CancellationToken cancellationToken = default)
    {
        cache.Remove(key);
        return Task.CompletedTask;
    }
}