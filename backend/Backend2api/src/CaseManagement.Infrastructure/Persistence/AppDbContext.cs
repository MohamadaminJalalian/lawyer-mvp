// CaseManagement.Infrastructure/Persistence/AppDbContext.cs
// Authors: Tarokh Torabi & Mohammad Amin Jalalian

using CaseManagement.Domain.Entities;
using CaseManagement.Domain.ValueObjects;
using Microsoft.EntityFrameworkCore;

namespace CaseManagement.Infrastructure.Persistence;

public class AppDbContext : DbContext
{
    public AppDbContext(DbContextOptions<AppDbContext> options)
        : base(options)
    {
    }

    public DbSet<Client> Clients => Set<Client>();
    public DbSet<CaseCategory> CaseCategories => Set<CaseCategory>();
    public DbSet<Case> Cases => Set<Case>();
    public DbSet<CaseStatusHistory> CaseStatusHistories => Set<CaseStatusHistory>();
    public DbSet<CaseFileAttachment> CaseFileAttachments => Set<CaseFileAttachment>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        modelBuilder.ApplyConfigurationsFromAssembly(typeof(AppDbContext).Assembly);

        // CourtInfo value object owned by Case
        modelBuilder.Entity<Case>()
            .OwnsOne(c => c.CourtInfo, court =>
            {
                court.Property(ci => ci.CourtCaseNumber)
                    .HasColumnName("CourtCaseNumber")
                    .HasMaxLength(64);

                court.Property(ci => ci.CourtName)
                    .HasColumnName("CourtName")
                    .HasMaxLength(256);

                court.Property(ci => ci.OpponentName)
                    .HasColumnName("OpponentName")
                    .HasMaxLength(256);
            });
    }
}
