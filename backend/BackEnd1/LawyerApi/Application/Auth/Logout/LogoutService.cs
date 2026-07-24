using LawyerApi.Infrastructure.Persistence;
using LawyerApi.Infrastructure.Security;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;

namespace LawyerApi.Application.Auth.Logout;

public class LogoutService
{
    private readonly AppDbContext _context;
    private readonly CookieService _cookieService;
    private readonly IHttpContextAccessor _httpContextAccessor;

    public LogoutService(
        AppDbContext context,
        CookieService cookieService,
        IHttpContextAccessor httpContextAccessor)
    {
        _context = context;
        _cookieService = cookieService;
        _httpContextAccessor = httpContextAccessor;
    }

    public async Task<bool> LogoutAsync()
    {
        var httpContext = _httpContextAccessor.HttpContext;
        var user = httpContext?.User;

        if (httpContext is null || user?.Identity?.IsAuthenticated != true)
            return false;

        var jti = user.FindFirstValue(JwtRegisteredClaimNames.Jti);

        if (!string.IsNullOrWhiteSpace(jti))
        {
            var session = await _context.UserSessions
                .FirstOrDefaultAsync(x => x.JwtId == jti);

            if (session is not null && session.RevokedAt is null)
            {
                session.RevokedAt = DateTime.UtcNow;
                await _context.SaveChangesAsync();
            }
        }

        _cookieService.RemoveAuthCookie(httpContext.Response);
        return true;
    }
}