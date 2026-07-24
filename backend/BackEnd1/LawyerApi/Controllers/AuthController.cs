using LawyerApi.Application.Auth.CurrentUser;
using LawyerApi.Application.Auth.Login;
using LawyerApi.Application.Auth.Logout;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace LawyerApi.Api.Controllers;

[ApiController]
[Route("auth")]
public class AuthController : ControllerBase
{
    private readonly LoginService _loginService;
    private readonly CurrentUserService _currentUserService;
    private readonly LogoutService _logoutService;

    public AuthController(
        LoginService loginService,
        CurrentUserService currentUserService,
        LogoutService logoutService)
    {
        _loginService = loginService;
        _currentUserService = currentUserService;
        _logoutService = logoutService;
    }

    [HttpPost("login")]
    public async Task<IActionResult> Login([FromBody] LoginRequest request)
    {
        if (!ModelState.IsValid)
            return BadRequest(ModelState);

        var result = await _loginService.LoginAsync(request);

        if (result is null)
        {
            return Unauthorized(new
            {
                message = "Invalid username or password."
            });
        }

        return Ok(result);
    }

    [Authorize]
    [HttpPost("logout")]
    public async Task<IActionResult> Logout()
    {
        await _logoutService.LogoutAsync();
        return Ok(new LogoutResponse());
    }

    [Authorize]
    [HttpGet("me")]
    public async Task<IActionResult> Me()
    {
        var result = await _currentUserService.GetCurrentUserAsync();

        if (result is null)
            return Unauthorized();

        return Ok(result);
    }
}