using CaseManagement.Application.Clients;
using CaseManagement.Application.Clients.Interfaces;
using Microsoft.Extensions.DependencyInjection;

namespace CaseManagement.Application
{
    public static class DependencyInjection
    {
        public static IServiceCollection AddApplication(this IServiceCollection services)
        {
            // ClientService registration
            services.AddScoped<IClientService, ClientService>();

            // TODO: سایر سرویس‌های Application را اینجا اضافه کن
            // services.AddScoped<ICaseService, CaseService>();
            // services.AddScoped<ICategoryService, CategoryService>();

            return services;
        }
    }
}
