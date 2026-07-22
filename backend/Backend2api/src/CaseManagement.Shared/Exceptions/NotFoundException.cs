// CaseManagement.Shared/Exceptions/NotFoundException.cs
// Authors: Tarokh Torabi & Mohammad Amin Jalalian

namespace CaseManagement.Shared.Exceptions;

public sealed class NotFoundException : Exception
{
    public NotFoundException(string message)
        : base(message)
    {
    }

    public static NotFoundException ForEntity(string entityName, Guid id) =>
        new NotFoundException($"{entityName} with id '{id}' was not found.");
}

