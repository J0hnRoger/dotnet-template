namespace DotnetTemplate.Domain.Common;

public sealed record ValidationError : Error
{
    public ValidationError(Error[] errors)
        : base(
            "Validation.General",
            "One or more validation errors occurred",
            ErrorType.Validation)
    {
        Errors = errors;
    }

    private ValidationError(string[] errors) : base(
        "Validation.General",
        "One or more validation errors occurred",
        ErrorType.Validation)

    {
        Errors = errors.Select(e => new Error("Validation.Entity", e, ErrorType.Validation))
            .ToArray();
    }

    public Error[] Errors { get; }

    public static ValidationError FromResults(IEnumerable<Result> results) =>
        new(results.Where(r => r.IsFailure)
            .Select(r => r.Error).ToArray());
}