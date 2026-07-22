// CaseManagement.Infrastructure/Persistence/AppDbContext.cs
// Authors: Tarokh Torabi & Mohammad Amin Jalalian

using CaseManagement.Domain.Entities;
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

        // Apply entity configurations from this assembly
        modelBuilder.ApplyConfigurationsFromAssembly(typeof(AppDbContext).Assembly);
    }
}
                court.Property(ci => ci.CourtName)
                    .HasColumnName("CourtName")
                    .HasMaxLength(256);

                court.Property(ci => ci.OpponentName)
                    .HasColumnName("OpponentName")
                    .HasMaxLength(256);
            });
    }
}
