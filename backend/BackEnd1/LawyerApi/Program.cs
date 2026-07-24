using LawyerApi.Application.Auth.CurrentUser;
using LawyerApi.Application.Auth.Login;
using LawyerApi.Application.Auth.Logout;
using LawyerApi.Domain.Enums;
using LawyerApi.Infrastructure.Options;
using LawyerApi.Infrastructure.Persistence;
using LawyerApi.Infrastructure.Security;
using LawyerApi.Shared.Authorization;
using LawyerApi.Shared.Middleware;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using Scalar.AspNetCore;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

var builder = WebApplication.CreateBuilder(args);

// Options
builder.Services.Configure<JwtOptions>(
    builder.Configuration.GetSection(JwtOptions.SectionName));

builder.Services.Configure<AuthCookieOptions>(
    builder.Configuration.GetSection(AuthCookieOptions.SectionName));

var jwtOptions = builder.Configuration
    .GetSection(JwtOptions.SectionName)
    .Get<JwtOptions>()!;

var authCookieOptions = builder.Configuration
    .GetSection(AuthCookieOptions.SectionName)
    .Get<AuthCookieOptions>()!;

// CORS (اگر فعلاً origin نداری، این بخش را در appsettings.Development.json پر کن)
var allowedOrigins = builder.Configuration
    .GetSection("Cors:AllowedOrigins")
    .Get<string[]>() ?? Array.Empty<string>();

if (allowedOrigins.Length > 0)
{
    builder.Services.AddCors(options =>
    {
        options.AddPolicy("FrontendCors", policy =>
        {
            policy.WithOrigins(allowedOrigins)
                  .AllowAnyHeader()
                  .AllowAnyMethod()
                  .AllowCredentials();
        });
    });
}

// Authentication
builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options =>
    {
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuer = true,
            ValidateAudience = true,
            ValidateLifetime = true,
            ValidateIssuerSigningKey = true,

            ValidIssuer = jwtOptions.Issuer,
            ValidAudience = jwtOptions.Audience,
            IssuerSigningKey = new SymmetricSecurityKey(
                Encoding.UTF8.GetBytes(jwtOptions.Secret)),

            ClockSkew = TimeSpan.Zero,

            NameClaimType = JwtRegisteredClaimNames.Sub,
            RoleClaimType = "role"
        };

        options.Events = new JwtBearerEvents
        {
            OnMessageReceived = context =>
            {
                if (context.Request.Cookies.TryGetValue(authCookieOptions.Name, out var token))
                {
                    context.Token = token;
                }

                return Task.CompletedTask;
            },

            OnTokenValidated = async context =>
            {
                var db = context.HttpContext.RequestServices
                    .GetRequiredService<AppDbContext>();

                var jti = context.Principal?
                    .FindFirstValue(JwtRegisteredClaimNames.Jti);

                if (string.IsNullOrWhiteSpace(jti))
                {
                    context.Fail("Invalid session.");
                    return;
                }

                var session = await db.UserSessions
                    .Include(x => x.User)
                    .FirstOrDefaultAsync(x => x.JwtId == jti);

                if (session is null ||
                    session.RevokedAt is not null ||
                    session.ExpiresAt <= DateTime.UtcNow ||
                    !session.User.IsActive)
                {
                    context.Fail("Session is not valid.");
                }
            }
        };
    });

// Authorization
builder.Services.AddAuthorization(options =>
{
    options.AddPolicy(Policies.AdminOnly, policy =>
        policy.RequireRole(UserRole.Admin.ToString().ToUpperInvariant()));

    options.AddPolicy(Policies.StaffOnly, policy =>
        policy.RequireRole(UserRole.Staff.ToString().ToUpperInvariant()));

    options.AddPolicy(Policies.AdminOrStaff, policy =>
        policy.RequireRole(
            UserRole.Admin.ToString().ToUpperInvariant(),
            UserRole.Staff.ToString().ToUpperInvariant()));
});

builder.Services.AddControllers();
builder.Services.AddHttpContextAccessor();
builder.Services.AddOpenApi();

// App services
builder.Services.AddScoped<CurrentUserService>();
builder.Services.AddScoped<LogoutService>();
builder.Services.AddScoped<LoginService>();
builder.Services.AddScoped<PasswordService>();
builder.Services.AddScoped<JwtTokenService>();
builder.Services.AddScoped<CookieService>();
builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseSqlServer(
        builder.Configuration.GetConnectionString("DefaultConnection")));

var app = builder.Build();

app.UseMiddleware<ExceptionHandlingMiddleware>();

app.UseHttpsRedirection();

if (allowedOrigins.Length > 0)
{
    app.UseCors("FrontendCors");
}

app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();

if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
    app.MapScalarApiReference();
}

using (var scope = app.Services.CreateScope())
{
    var context = scope.ServiceProvider.GetRequiredService<AppDbContext>();
    var passwordService = scope.ServiceProvider.GetRequiredService<PasswordService>();

    await SeedData.InitializeAsync(context, passwordService);
}

app.Run();