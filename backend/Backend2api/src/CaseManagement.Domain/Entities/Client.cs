// CaseManagement.Domain/Entities/Client.cs
// Authors: Tarokh Torabi & Mohammad Amin Jalalian

using CaseManagement.Domain.Common;

namespace CaseManagement.Domain.Entities;

public sealed class Client : BaseEntity
{
    public string FullName { get; set; } = default!;
    public string? NationalCode { get; set; }
    public string? PhoneNumber { get; set; }
    public string? InternalNumber { get; set; }
    public string? Description { get; set; }

    // Navigation
    public ICollection<Case> Cases { get; set; } = new List<Case>();
}
