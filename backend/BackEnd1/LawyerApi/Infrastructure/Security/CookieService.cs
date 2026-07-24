using LawyerApi.Infrastructure.Options;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Options;

namespace LawyerApi.Infrastructure.Security;

public class CookieService
{
    private readonly JwtOptions _jwtOptions;
    private readonly AuthCookieOptions _cookieOptions;

    public CookieService(
        IOptions<JwtOptions> jwtOptions,
        IOptions<AuthCookieOptions> cookieOptions)
    {
        _jwtOptions = jwtOptions.Value;
        _cookieOptions = cookieOptions.Value;
    }

    public void SetAuthCookie(HttpResponse response, string token)
    {
        response.Cookies.Append(
            _cookieOptions.Name,
            token,
            new CookieOptions
            {
                HttpOnly = true,
                Secure = _cookieOptions.Secure,
                SameSite = SameSiteMode.Lax,
                Path = "/",
                Expires = DateTimeOffset.UtcNow.AddHours(_jwtOptions.ExpiresHours),
                MaxAge = TimeSpan.FromHours(_jwtOptions.ExpiresHours),
            });
    }

    public void RemoveAuthCookie(HttpResponse response)
    {
        response.Cookies.Delete(
            _cookieOptions.Name,
            new CookieOptions
            {
                Path = "/"
            });
    }
}