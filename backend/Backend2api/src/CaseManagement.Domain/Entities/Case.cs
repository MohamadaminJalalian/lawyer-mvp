// CaseManagement.Domain/Entities/Case.cs
// Authors: Tarokh Torabi & Mohammad Amin Jalalian

using CaseManagement.Domain.Common;
using CaseManagement.Domain.Enums;
using CaseManagement.Domain.ValueObjects;

namespace CaseManagement.Domain.Entities;

public sealed class Case : BaseEntity
{
    public string Title { get; set; } = default!;
    public string? Description { get; set; }

    public Guid ClientId { get; set; }
    public Guid CategoryId { get; set; }

    public CaseStatus Status { get; set; }
    public CasePriority Priority { get; set; }

    public DateTime? StartDate { get; set; }
    public DateTime? DueDate { get; set; }
    public DateTime? ClosedAtUtc { get; set; }

    // Court-related info as value object
    public CourtInfo? CourtInfo { get; set; }

    // Navigation properties
    public Client Client { get; set; } = default!;
    public CaseCategory Category { get; set; } = default!;

    public ICollection<CaseStatusHistory> StatusHistory { get; set; } = new List<CaseStatusHistory>();
    public ICollection<CaseFileAttachment> Attachments { get; set; } = new List<CaseFileAttachment>();
}
