// CaseManagement.Domain/Entities/CaseCategory.cs
// Authors: Tarokh Torabi & Mohammad Amin Jalalian

using CaseManagement.Domain.Common;

namespace CaseManagement.Domain.Entities;

public sealed class CaseCategory : BaseEntity
{
    public string Name { get; set; } = default!;
    public string? Description { get; set; }

    // Navigation
    public ICollection<Case> Cases { get; set; } = new List<Case>();
}
