// CaseManagement.Infrastructure/Persistence/Configurations/CaseFileAttachmentConfiguration.cs

using CaseManagement.Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace CaseManagement.Infrastructure.Persistence.Configurations;

public sealed class CaseFileAttachmentConfiguration : IEntityTypeConfiguration<CaseFileAttachment>
{
    public void Configure(EntityTypeBuilder<CaseFileAttachment> builder)
    {
        builder.ToTable("CaseFileAttachments");

        builder.HasKey(a => a.Id);

        builder.Property(a => a.FileName)
            .IsRequired()
            .HasMaxLength(256);

        builder.Property(a => a.FilePath)
            .IsRequired()
            .HasMaxLength(512);

        builder.Property(a => a.FileSizeBytes)
            .IsRequired();

        builder.Property(a => a.ContentType)
            .HasMaxLength(128);

        builder.Property(a => a.CreatedAtUtc).IsRequired();
        builder.Property(a => a.CreatedByUserId).IsRequired();
        builder.Property(a => a.IsArchived).IsRequired();

        builder.HasOne(a => a.Case)
            .WithMany(c => c.Attachments)
            .HasForeignKey(a => a.CaseId)
            .OnDelete(DeleteBehavior.Cascade);
    }
}
