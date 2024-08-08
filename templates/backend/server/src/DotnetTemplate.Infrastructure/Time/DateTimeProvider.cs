using DotnetTemplate.Domain.Common;

namespace DotnetTemplate.Infrastructure.Time;

internal sealed class DateTimeProvider : IDateTimeProvider
{
    public DateTime UtcNow => DateTime.UtcNow;
}
