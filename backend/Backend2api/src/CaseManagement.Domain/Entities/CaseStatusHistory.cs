// CaseManagement.Domain/Entities/CaseStatusHistory.cs
// Authors: Tarokh Torabi & Mohammad Amin Jalalian

using CaseManagement.Domain.Common;
using CaseManagement.Domain.Enums;

namespace CaseManagement.Domain.Entities;

public sealed class CaseStatusHistory : BaseEntity
{
    public Guid CaseId { get; set; }

    public CaseStatus OldStatus { get; set; }
    public CaseStatus NewStatus { get; set; }

    public string? Comment { get; set; }

    public DateTime ChangedAtUtc { get; set; }

    // Navigation
    public Case Case { get; set; } = default!;
}
