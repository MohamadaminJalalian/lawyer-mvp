// CaseManagement.Domain/Common/BaseEntity.cs
// Authors: Tarokh Torabi & Mohammad Amin Jalalian

namespace CaseManagement.Domain.Common;

public abstract class BaseEntity
{
    public Guid Id { get; set; }

    public DateTime CreatedAtUtc { get; set; }

    public Guid CreatedByUserId { get; set; }

    public DateTime? UpdatedAtUtc { get; set; }

    public Guid? UpdatedByUserId { get; set; }

    public bool IsArchived { get; set; }
}

