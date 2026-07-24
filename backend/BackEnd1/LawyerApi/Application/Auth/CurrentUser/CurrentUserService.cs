using System.Security.Claims;
using LawyerApi.Infrastructure.Persistence;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;
using System.IdentityModel.Tokens.Jwt;

namespace LawyerApi.Application.Auth.CurrentUser;

public class CurrentUserService
{
    private readonly AppDbContext _context;
    private readonly IHttpContextAccessor _httpContextAccessor;

    public CurrentUserService(
        AppDbContext context,
        IHttpContextAccessor httpContextAccessor)
    {
        _context = context;
        _httpContextAccessor = httpContextAccessor;
    }

    public async Task<CurrentUserResponse?> GetCurrentUserAsync()
    {
        var userIdClaim = _httpContextAccessor.HttpContext?.User
            .FindFirst(JwtRegisteredClaimNames.Sub)?.Value;

        if (string.IsNullOrWhiteSpace(userIdClaim))
            return null;

        if (!Guid.TryParse(userIdClaim, out var userId))
            return null;

        var user = await _context.Users
            .AsNoTracking()
            .FirstOrDefaultAsync(x => x.Id == userId);

        if (user is null)
            return null;

        return new CurrentUserResponse
        {
            Id = user.Id,
            FullName = user.FullName,
            Username = user.Username,
            Role = user.Role.ToString().ToUpperInvariant()
        };
    }
}