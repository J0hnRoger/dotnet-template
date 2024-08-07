namespace DotnetTemplate.Domain.Common;

public interface IDateTimeProvider
{
    public DateTime UtcNow { get; }
}
