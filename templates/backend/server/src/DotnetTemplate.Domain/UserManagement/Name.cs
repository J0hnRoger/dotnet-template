using DotnetTemplate.Domain.Common;

namespace DotnetTemplate.Domain.UserManagement;

public sealed record Name
{
    public Name(string? value)
    {
        Ensure.NotNullOrEmpty(value);

        Value = value;
    }

    public string Value { get; }
}
