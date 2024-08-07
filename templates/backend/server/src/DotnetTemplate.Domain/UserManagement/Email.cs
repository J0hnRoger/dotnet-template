using CSharpFunctionalExtensions;
using DotnetTemplate.Domain.Common;

namespace DotnetTemplate.Domain.UserManagement;

public sealed record Email
{
    private Email(string value) => Value = value;

    public string Value { get; }

    public static Result<Email, Error> Create(string? email)
    {
        if (string.IsNullOrEmpty(email))
        {
            return Result.Failure<Email, Error>(EmailErrors.Empty);
        }

        if (email.Split('@').Length != 2)
        {
            return Result.Failure<Email, Error>(EmailErrors.InvalidFormat);
        }

        return new Email(email);
    }
}
