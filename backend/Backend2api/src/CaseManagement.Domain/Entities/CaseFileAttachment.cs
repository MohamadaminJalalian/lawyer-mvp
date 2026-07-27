// CaseManagement.Domain/Entities/CaseFileAttachment.cs
// Authors: Tarokh Torabi & Mohammad Amin Jalalian

using CaseManagement.Domain.Common;

namespace CaseManagement.Domain.Entities;

public sealed class CaseFileAttachment : BaseEntity
{
    public Guid CaseId { get; set; }

    public string FileName { get; set; } = default!;
    public string FilePath { get; set; } = default!;
    public long FileSizeBytes { get; set; }

    public string? ContentType { get; set; }

    // Navigation
    public Case Case { get; set; } = default!;
}
