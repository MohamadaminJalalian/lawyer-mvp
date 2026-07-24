using CaseManagement.Domain.Entities;
using Microsoft.EntityFrameworkCore;

namespace CaseManagement.Infrastructure.Persistence
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options)
            : base(options)
        {
        }

        public DbSet<Client> Clients { get; set; }
        public DbSet<Category> Categories { get; set; }
        public DbSet<Case> Cases { get; set; }
        public DbSet<FileAttachment> FileAttachments { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            ConfigureClient(modelBuilder);
            ConfigureCategory(modelBuilder);
            ConfigureCase(modelBuilder);
            ConfigureFileAttachment(modelBuilder);
        }

        private static void ConfigureClient(ModelBuilder modelBuilder)
        {
            var entity = modelBuilder.Entity<Client>();

            entity.ToTable("Clients");

            entity.HasKey(c => c.Id);

            entity.Property(c => c.FirstName)
                  .IsRequired()
                  .HasMaxLength(100);

            entity.Property(c => c.LastName)
                  .IsRequired()
                  .HasMaxLength(100);

            entity.Property(c => c.NationalId)
                  .IsRequired()
                  .HasMaxLength(10);

            entity.HasIndex(c => c.NationalId)
                  .IsUnique();

            entity.HasMany(c => c.Cases)
                  .WithOne(cs => cs.Client)
                  .HasForeignKey(cs => cs.ClientId)
                  .OnDelete(DeleteBehavior.Restrict);
        }

        private static void ConfigureCategory(ModelBuilder modelBuilder)
        {
            var entity = modelBuilder.Entity<Category>();

            entity.ToTable("Categories");

            entity.HasKey(c => c.Id);

            entity.Property(c => c.Name)
                  .IsRequired()
                  .HasMaxLength(200);

            entity.HasIndex(c => c.Name)
                  .IsUnique();

            entity.HasMany(c => c.Cases)
                  .WithOne(cs => cs.Category)
                  .HasForeignKey(cs => cs.CategoryId)
                  .OnDelete(DeleteBehavior.Restrict);
        }

        private static void ConfigureCase(ModelBuilder modelBuilder)
        {
            var entity = modelBuilder.Entity<Case>();

            entity.ToTable("Cases");

            entity.HasKey(c => c.Id);

            entity.Property(c => c.Title)
                  .IsRequired()
                  .HasMaxLength(200);

            entity.Property(c => c.Status)
                  .IsRequired()
                  .HasMaxLength(50); // ACTIVE / ARCHIVED

            entity.Property(c => c.CreatedAt)
                  .IsRequired();

            entity.Property(c => c.UpdatedAt)
                  .IsRequired(false);

            entity.HasOne(c => c.Client)
                  .WithMany(cl => cl.Cases)
                  .HasForeignKey(c => c.ClientId)
                  .OnDelete(DeleteBehavior.Restrict);

            entity.HasOne(c => c.Category)
                  .WithMany(cat => cat.Cases)
                  .HasForeignKey(c => c.CategoryId)
                  .OnDelete(DeleteBehavior.Restrict);
        }

        private static void ConfigureFileAttachment(ModelBuilder modelBuilder)
        {
            var entity = modelBuilder.Entity<FileAttachment>();

            entity.ToTable("FileAttachments");

            entity.HasKey(f => f.Id);

            entity.Property(f => f.FileName)
                  .IsRequired()
                  .HasMaxLength(255);

            entity.Property(f => f.ContentType)
                  .IsRequired()
                  .HasMaxLength(100);

            entity.Property(f => f.Size)
                  .IsRequired();

            entity.HasOne(f => f.Case)
                  .WithMany(c => c.Attachments)
                  .HasForeignKey(f => f.CaseId)
                  .OnDelete(DeleteBehavior.Cascade);
        }
    }
}
            });
    }
}
