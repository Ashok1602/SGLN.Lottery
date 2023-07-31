using ACG.SGLN.Lottery.Application.Common.Interfaces;
using ACG.SGLN.Lottery.RazorHtmlEmails.Services;
using Microsoft.Extensions.DependencyInjection;

namespace ACG.SGLN.Lottery.RazorHtmlEmails
{
    public static class DependencyInjection
    {
        public static IServiceCollection AddRazorHtmlEmails(this IServiceCollection services)
        {
            services.AddScoped<ITemplateToStringRenderer, RazorViewToStringRenderer>();
            services.AddScoped<IEmailSender, EmailSender>();

            return services;
        }
    }
}