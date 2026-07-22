// CaseManagement.Infrastructure/Persistence/Configurations/ClientConfiguration.cs
// Authors: Tarokh Torabi & Mohammad Amin Jalalian

using CaseManagement.Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace CaseManagement.Infrastructure.Persistence.Configurations;

public sealed class ClientConfiguration : IEntityTypeConfiguration<Client>
{
    public void Configure(EntityTypeBuilder<Client> builder)
    {
        builder.ToTable("Clients");

        builder.HasKey(c => c.Id);

        builder.Property(c => c.FullName)
            .IsRequired()
            .HasMaxLength(256);

        builder.Property(c => c.NationalCode)
            .HasMaxLength(10);

        builder.Property(c => c.PhoneNumber)
            .HasMaxLength(32);

        builder.Property(c => c.InternalNumber)
            .HasMaxLength(32);

        builder.Property(c => c.Description)
            .HasMaxLength(1024);

        // Audit fields
        builder.Property(c => c.CreatedAtUtc).IsRequired();
        builder.Property(c => c.CreatedByUserId).IsRequired();
        builder.Property(c => c.IsArchived).IsRequired();

        // Unique indexes (based on 001_create_tables.sql)
        builder.HasIndex(c => c.NationalCode)
            .IsUnique()
            .HasFilter("[NationalCode] IS NOT NULL");

        builder.HasIndex(c => c.InternalNumber)
            .IsUnique()
            .HasFilter("[InternalNumber] IS NOT NULL");
    }
}
