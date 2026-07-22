// CaseManagement.Shared/Exceptions/ConflictException.cs
// Authors: Tarokh Torabi & Mohammad Amin Jalalian

namespace CaseManagement.Shared.Exceptions;

public sealed class ConflictException : Exception
{
    public ConflictException(string message)
        : base(message)
    {
    }

    public static ConflictException Duplicate(string entityName, string fieldName) =>
        new ConflictException($"{entityName} with the same {fieldName} already exists.");
}

