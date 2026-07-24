using LawyerApi.Domain.Entities;
using LawyerApi.Domain.Enums;
using LawyerApi.Infrastructure.Security;
using Microsoft.EntityFrameworkCore;

namespace LawyerApi.Infrastructure.Persistence;

public static class SeedData
{
    public static async Task InitializeAsync(
        AppDbContext context,
        PasswordService passwordService)
    {
        await context.Database.MigrateAsync();

        if (await context.Users.AnyAsync())
            return;

        var admin = new User
        {
            Id = Guid.NewGuid(),
            FullName = "System Administrator",
            Username = "admin",
            PasswordHash = passwordService.HashPassword("Admin123!"),
            Role = UserRole.Admin,
            IsActive = true,
            CreatedAt = DateTime.UtcNow,
            UpdatedAt = DateTime.UtcNow
        };

        var staff = new User
        {
            Id = Guid.NewGuid(),
            FullName = "Office Staff",
            Username = "staff",
            PasswordHash = passwordService.HashPassword("Staff123!"),
            Role = UserRole.Staff,
            IsActive = true,
            CreatedAt = DateTime.UtcNow,
            UpdatedAt = DateTime.UtcNow
        };

        context.Users.Add(admin);
        context.Users.Add(staff);

        await context.SaveChangesAsync();
    }
}