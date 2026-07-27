// CaseManagement.Infrastructure/Persistence/Configurations/CaseCategoryConfiguration.cs

using CaseManagement.Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace CaseManagement.Infrastructure.Persistence.Configurations;

public sealed class CaseCategoryConfiguration : IEntityTypeConfiguration<CaseCategory>
{
    public void Configure(EntityTypeBuilder<CaseCategory> builder)
    {
        builder.ToTable("CaseCategories");

        builder.HasKey(c => c.Id);

        builder.Property(c => c.Name)
            .IsRequired()
            .HasMaxLength(128);

        builder.Property(c => c.Description)
            .HasMaxLength(512);

        builder.Property(c => c.CreatedAtUtc).IsRequired();
        builder.Property(c => c.CreatedByUserId).IsRequired();
        builder.Property(c => c.IsArchived).IsRequired();

        builder.HasIndex(c => c.Name)
            .IsUnique();
    }
}
