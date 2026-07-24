using LawyerApi.Domain.Entities;
using Microsoft.EntityFrameworkCore;
using LawyerApi.Infrastructure.Persistence;
using LawyerApi.Infrastructure.Security;
using Microsoft.AspNetCore.Http;
using LawyerApi.Infrastructure.Options;
using Microsoft.Extensions.Options;
using LawyerApi.Application.Auth.CurrentUser;

namespace LawyerApi.Application.Auth.Login;

public class LoginService
{
    private readonly AppDbContext _context;
    private readonly PasswordService _passwordService;
    private readonly JwtTokenService _jwtTokenService;
    private readonly CookieService _cookieService;
    private readonly IHttpContextAccessor _httpContextAccessor;
    private readonly JwtOptions _jwtOptions;

    public LoginService(
        AppDbContext context,
        PasswordService passwordService,
        JwtTokenService jwtTokenService,
        CookieService cookieService,
        IHttpContextAccessor httpContextAccessor,
        IOptions<JwtOptions> jwtOptions)
    {
        _context = context;
        _passwordService = passwordService;
        _jwtTokenService = jwtTokenService;
        _cookieService = cookieService;
        _httpContextAccessor = httpContextAccessor;
        _jwtOptions = jwtOptions.Value;
    }

    private async Task<User?> FindUserAsync(string username)
    {
        return await _context.Users
            .FirstOrDefaultAsync(x => x.Username == username);
    }

    private static bool IsLocked(User user)
    {
        return user.LockoutEnd.HasValue &&
               user.LockoutEnd.Value > DateTime.UtcNow;
    }

    private async Task HandleFailedLoginAsync(User user)
    {
        user.FailedLoginCount++;

        if (user.FailedLoginCount >= 5)
        {
            user.LockoutEnd = DateTime.UtcNow.AddMinutes(15);
        }

        await _context.SaveChangesAsync();
    }

    private async Task HandleSuccessfulLoginAsync(User user)
    {
        user.FailedLoginCount = 0;
        user.LockoutEnd = null;

        await _context.SaveChangesAsync();
    }

    private (UserSession Session, string Token) CreateSession(User user)
    {
        var jwtId = Guid.NewGuid().ToString();

        var token = _jwtTokenService.GenerateToken(user, jwtId);

        var session = new UserSession
        {
            Id = Guid.NewGuid(),
            UserId = user.Id,
            JwtId = jwtId,
            CreatedAt = DateTime.UtcNow,
            ExpiresAt = DateTime.UtcNow.AddHours(_jwtOptions.ExpiresHours)
        };

        _context.UserSessions.Add(session);

        return (session, token);
    }

    public async Task<LoginResponse?> LoginAsync(LoginRequest request)
    {
        var user = await FindUserAsync(request.Username);

        if (user is null)
            return null;

        if (!user.IsActive)
            return null;

        if (IsLocked(user))
            return null;

        var passwordValid = _passwordService.VerifyPassword(
            request.Password,
            user.PasswordHash);

        if (!passwordValid)
        {
            await HandleFailedLoginAsync(user);
            return null;
        }

        await HandleSuccessfulLoginAsync(user);

        var expiresAt = DateTime.UtcNow.AddHours(_jwtOptions.ExpiresHours);

        var (session, token) = CreateSession(user);

        await _context.SaveChangesAsync();

        _cookieService.SetAuthCookie(
            _httpContextAccessor.HttpContext!.Response,
            token);

        return new LoginResponse
        {
            User = new CurrentUserResponse
            {
                Id = user.Id,
                FullName = user.FullName,
                Username = user.Username,
                Role = user.Role.ToString().ToUpperInvariant()
            },

            ExpiresAt = expiresAt
        };
    }
}