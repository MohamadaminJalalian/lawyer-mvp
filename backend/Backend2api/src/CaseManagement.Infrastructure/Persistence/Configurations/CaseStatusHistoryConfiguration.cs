// CaseManagement.Infrastructure/Persistence/Configurations/CaseStatusHistoryConfiguration.cs

using CaseManagement.Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace CaseManagement.Infrastructure.Persistence.Configurations;

public sealed class CaseStatusHistoryConfiguration : IEntityTypeConfiguration<CaseStatusHistory>
{
    public void Configure(EntityTypeBuilder<CaseStatusHistory> builder)
    {
        builder.ToTable("CaseStatusHistories");

        builder.HasKey(h => h.Id);

        builder.Property(h => h.Comment)
            .HasMaxLength(1024);

        builder.Property(h => h.ChangedAtUtc)
            .IsRequired();

        builder.Property(h => h.CreatedAtUtc).IsRequired();
        builder.Property(h => h.CreatedByUserId).IsRequired();
        builder.Property(h => h.IsArchived).IsRequired();

        builder.HasOne(h => h.Case)
            .WithMany(c => c.StatusHistory)
            .HasForeignKey(h => h.CaseId)
            .OnDelete(DeleteBehavior.Cascade);
    }
}
