// CaseManagement.Infrastructure/Persistence/Configurations/CaseConfiguration.cs

using CaseManagement.Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace CaseManagement.Infrastructure.Persistence.Configurations;

public sealed class CaseConfiguration : IEntityTypeConfiguration<Case>
{
    public void Configure(EntityTypeBuilder<Case> builder)
    {
        builder.ToTable("Cases");

        builder.HasKey(c => c.Id);

        builder.Property(c => c.Title)
            .IsRequired()
            .HasMaxLength(256);

        builder.Property(c => c.Description)
            .HasMaxLength(2048);

        builder.Property(c => c.Status)
            .IsRequired();

        builder.Property(c => c.Priority)
            .IsRequired();

        builder.Property(c => c.StartDate);
        builder.Property(c => c.DueDate);
        builder.Property(c => c.ClosedAtUtc);

        builder.Property(c => c.CreatedAtUtc).IsRequired();
        builder.Property(c => c.CreatedByUserId).IsRequired();
        builder.Property(c => c.IsArchived).IsRequired();

        // Relationships
        builder.HasOne(c => c.Client)
            .WithMany(client => client.Cases)
            .HasForeignKey(c => c.ClientId)
            .OnDelete(DeleteBehavior.Restrict);

        builder.HasOne(c => c.Category)
            .WithMany(cat => cat.Cases)
            .HasForeignKey(c => c.CategoryId)
            .OnDelete(DeleteBehavior.Restrict);
    }
}
