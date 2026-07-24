using LawyerApi.Application.Auth.CurrentUser;

namespace LawyerApi.Application.Auth.Login;

public class LoginResponse
{
    public CurrentUserResponse User { get; set; } = new();

    public DateTime ExpiresAt { get; set; }
}