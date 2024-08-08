using CSharpFunctionalExtensions;

namespace DotnetTemplate.Domain.Common;

public static class ResultExtensions
{
    public static Result<TValue> ValidationFailure<TValue>(this Result<TValue> result, Error error)
    {
        return result.ConvertFailure<TValue>();
    }
}