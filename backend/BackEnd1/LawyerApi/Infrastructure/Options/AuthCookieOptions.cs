namespace LawyerApi.Infrastructure.Options;

public class AuthCookieOptions
{
    public const string SectionName = "AuthCookie";

    public string Name { get; set; } = string.Empty;

    public bool Secure { get; set; }
}