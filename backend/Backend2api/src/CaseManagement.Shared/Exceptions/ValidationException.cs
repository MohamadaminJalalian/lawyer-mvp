// CaseManagement.Shared/Exceptions/ValidationException.cs
// Authors: Tarokh Torabi & Mohammad Amin Jalalian

namespace CaseManagement.Shared.Exceptions;

public sealed class ValidationException : Exception
{
    public Dictionary<string, string[]> Errors { get; }

    public ValidationException(Dictionary<string, string[]> errors)
        : base("Validation failed.")
    {
        Errors = errors;
    }

    public ValidationException(string field, string message)
        : this(new Dictionary<string, string[]>
        {
            { field, new[] { message } }
        })
    {
    }
}

