using ACG.SGLN.Lottery.Application.Common.Interfaces;
using ACG.SGLN.Lottery.Application.Common.Mappings;
using ACG.SGLN.Lottery.Domain.Constants;
using ACG.SGLN.Lottery.Domain.Options;
using ACG.SGLN.Lottery.Infrastructure.Identity;
using ACG.SGLN.Lottery.Infrastructure.Identity.Entities;
using ACG.SGLN.Lottery.Infrastructure.Identity.Stores;
using ACG.SGLN.Lottery.Infrastructure.Persistence;
using ACG.SGLN.Lottery.Infrastructure.Services;
using AutoMapper;
using IdentityServer4.AccessTokenValidation;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.IdentityModel.Tokens;
using System;
using System.Reflection;
using System.Text;

namespace ACG.SGLN.Lottery.Infrastructure
{
    public static class DependencyInjection
    {
        public static IServiceCollection AddInfrastructure(this IServiceCollection services,
            IConfiguration configuration, bool configureIdentityServer = false)
        {
            services.AddAutoMapper(Assembly.GetExecutingAssembly(), Assembly.GetAssembly(typeof(IMapFrom<>)));

            services.Configure<EmailOptions>(configuration.GetSection(ConfigurationConstants.Sections.Mail));

            if (configuration.GetValue<bool>("UsePgSql"))
                services.AddDbContext<ApplicationDbContext>(options =>
                    options.UseNpgsql(
                        configuration.GetConnectionString(nameof(ApplicationDbContext)),
                        b => b.MigrationsAssembly(typeof(ApplicationDbContext).Assembly.FullName)));
            else
                services.AddDbContext<ApplicationDbContext>(options =>
                    options.UseSqlServer(
                        configuration.GetConnectionString(nameof(ApplicationDbContext)),
                        b => b.MigrationsAssembly(typeof(ApplicationDbContext).Assembly.FullName)).AddInterceptors(new DbCommandInterceptor()));

            services.AddScoped<IApplicationDbContext>(provider => provider.GetService<ApplicationDbContext>());

            services.AddDefaultIdentity<ApplicationUser>(options =>
            {
                options.Password.RequireDigit = true;
                options.Password.RequireLowercase = true;
                options.Password.RequireUppercase = true;
                options.Password.RequiredLength = 6;
                options.Password.RequireNonAlphanumeric = false;
            })
                .AddRoles<ApplicationRole>()
                .AddRoleManager<RoleManager<ApplicationRole>>()
                .AddEntityFrameworkStores<ApplicationDbContext>()
                .AddUserStore<ApplicationUserStore>()
                .AddRoleStore<ApplicationRoleStore>();
            //.AddClaimsPrincipalFactory<ApplicationUserClaimsPrincipalFactory>();

            if (!configureIdentityServer)
            {
                var securityOptions = configuration.GetSection(ConfigurationConstants.Sections.Security)
                    .Get<SecurityOptions>();

                services.AddAuthentication(options =>
                {
                    options.DefaultAuthenticateScheme = IdentityServerAuthenticationDefaults.AuthenticationScheme;
                    options.DefaultChallengeScheme = IdentityServerAuthenticationDefaults.AuthenticationScheme;
                }).AddJwtBearer(options =>
                {
                    options.RequireHttpsMetadata = false;
                    options.SaveToken = true;
                    options.TokenValidationParameters = new TokenValidationParameters
                    {
                        ValidateIssuerSigningKey = true,
                        IssuerSigningKey = new SymmetricSecurityKey(Encoding.ASCII.GetBytes(securityOptions.JwtSecret)),
                        ValidateIssuer = false,
                        ValidateAudience = false,
                        LifetimeValidator = (before, expires, token, param) => expires > DateTime.UtcNow
                    };
                });
            }

            services.AddTransient<IDateTime, DateTimeService>();
            services.AddTransient<IMediaService, MediaService>();
            services.AddTransient<IIdentityService, IdentityService>();
            services.AddScoped<IMessageService, MessageService>();

            //services.AddSingleton<IStorage>(new BlobStorage(configuration.GetConnectionString("AzureBlobStorage")));
            services.AddStackExchangeRedisCache(options =>
            {
                options.Configuration = configuration.GetConnectionString("AzureRedisCache");
            });
            services.AddTransient<ICacheService, CacheService>();

            return services;
        }
    }
}