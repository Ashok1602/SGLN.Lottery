using ACG.SGLN.Lottery.Application;
using ACG.SGLN.Lottery.Application.Common.Interfaces;
using ACG.SGLN.Lottery.Domain.Constants;
using ACG.SGLN.Lottery.Domain.Entities;
using ACG.SGLN.Lottery.Domain.Options;
using ACG.SGLN.Lottery.Infrastructure;
using ACG.SGLN.Lottery.Infrastructure.Persistence;
using ACG.SGLN.Lottery.Infrastructure.Services;
using ACG.SGLN.Lottery.RazorHtmlEmails;
using ACG.SGLN.Lottery.RazorHtmlPdfPrint;
using ACG.SGLN.Lottery.WebApi.Mobile.Converters;
using ACG.SGLN.Lottery.WebUI.Common.Converters;
using ACG.SGLN.Lottery.WebUI.Common.Filters;
using ACG.SGLN.Lottery.WebUI.Common.Middlewares;
using ACG.SGLN.Lottery.WebUI.Common.Services;
using FirebaseAdmin;
using Google.Apis.Auth.OAuth2;
using Microsoft.AspNetCore.Antiforgery;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.FileProviders;
using Microsoft.Extensions.Logging;
using Newtonsoft.Json;
using Newtonsoft.Json.Converters;
using NSwag;
using NSwag.Generation.Processors.Security;
using System.Collections.Generic;
using System.IO;
using System.Linq;

namespace ACG.SGLN.Lottery.WebUI.Common
{
    public class StartupBase
    {
        public StartupBase(IConfiguration configuration)
        {
            Configuration = configuration;
        }

        public IConfiguration Configuration { get; }

        protected virtual List<JsonConverter> GetConverters()

        {
            return new List<JsonConverter>();
        }

        // This method gets called by the runtime. Use this method to add services to the container.
        public virtual void ConfigureServices(IServiceCollection services)
        {
            services.Configure<SecurityOptions>(Configuration.GetSection(ConfigurationConstants.Sections.Security));
            services.Configure<EmailOptions>(Configuration.GetSection(ConfigurationConstants.Sections.Mail));
            services.Configure<NfsOptions>(Configuration.GetSection(ConfigurationConstants.Sections.Nfs));
            services.Configure<MessagingOptions>(Configuration.GetSection(ConfigurationConstants.Sections.Messaging));
            services.Configure<TrainingOptions>(Configuration.GetSection(ConfigurationConstants.Sections.Training));
            services.Configure<InvoiceOptions>(Configuration.GetSection(ConfigurationConstants.Sections.Invoice));

            services.AddApplication();
            services.AddRazorHtmlEmails();
            services.AddRazorHtmlPdfPrint();
            services.AddInfrastructure(Configuration);

            services.AddScoped<ICurrentUserService, CurrentUserService>();
            services.AddScoped<IPushNotificationSender, PushNotificationSender>();
            services.AddScoped<IFtpFileService, FtpFileService>();
            services.AddScoped<IZipFileService, ZipFileService>();
            services.AddSingleton<ILoggerProvider, FileLoggerService>();
            services.AddTransient<IStorage, LocalStorage>();

            services.AddSingleton<IFileProvider>(
                new PhysicalFileProvider(
                    Path.Combine(Directory.GetCurrentDirectory(), "wwwroot")));

            FirebaseApp.Create(
                new AppOptions()
                {
                    Credential = GoogleCredential.FromFile("Properties/serviceAccountKey.json")
                }
            );

            services.AddHttpContextAccessor();

            services.AddHealthChecks().AddDbContextCheck<ApplicationDbContext>();

            services.AddControllersWithViews(options =>
            {
                options.Filters.Add(new ApiExceptionFilter());
                //options.Filters.Add(new AuthorizeFilter(ScopePolicy.Create(Scope)));
            })
                .AddNewtonsoftJson(opts =>
                {
                    opts.SerializerSettings.ReferenceLoopHandling = ReferenceLoopHandling.Ignore;

                    opts.SerializerSettings.Converters.Add(new StringEnumConverter());
                    opts.SerializerSettings.Converters.Add(new DecimalConverter());
                    opts.SerializerSettings.Converters.Add(new ApplicationDocumentConverter());
                    opts.SerializerSettings.Converters.Add(new AnnouncementConverter());
                    opts.SerializerSettings.Converters.Add(new RequestObjectConverter());
                    opts.SerializerSettings.Converters.Add(new DocumentConverter<Announcement>());
                    opts.SerializerSettings.Converters.Add(new DocumentConverter<RetailerDocument>());
                    opts.SerializerSettings.Converters.Add(new DocumentConverter<RequestDocument>());
                    opts.SerializerSettings.Converters.Add(new DocumentConverter<ApplicationDocument>());
                    opts.SerializerSettings.Converters.Add(new DocumentConverter<RequestObject>());

                    foreach (var converter in GetConverters())
                        opts.SerializerSettings.Converters.Add(converter);
                });

            services.AddRouting(options => options.LowercaseUrls = true);
            services.AddRazorPages();

            // Customise default API behaviour
            services.Configure<ApiBehaviorOptions>(options => { options.SuppressModelStateInvalidFilter = true; });

            services.AddOpenApiDocument(configure =>
            {
                configure.Title = "ACG.SGLN.Lottery API";
                configure.AddSecurity("JWT", Enumerable.Empty<string>(), new OpenApiSecurityScheme
                {
                    Type = OpenApiSecuritySchemeType.ApiKey,
                    Name = "Authorization",
                    In = OpenApiSecurityApiKeyLocation.Header,
                    Description = "Type into the textbox: Bearer {your JWT token}."
                });

                configure.OperationProcessors.Add(new AspNetCoreOperationSecurityScopeProcessor("JWT"));
            });

            services.AddCors(options =>
            {
                options.AddDefaultPolicy(builder =>
                {
                    builder.WithOrigins("http://localhost:3000");
                    builder.WithOrigins("https://localhost:3000");

                    builder.WithOrigins("https://sglnlottery-bo.azurewebsites.net");
                    builder.WithOrigins("http://sglnlottery-bo.azurewebsites.net");

                    builder.WithOrigins("https://sglnlottery-bo-test.azurewebsites.net");
                    builder.WithOrigins("http://sglnlottery-bo-test.azurewebsites.net");

                    builder.AllowAnyHeader();
                    builder.AllowAnyMethod();
                });
            });
        }

        // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
        public virtual void Configure(IApplicationBuilder app, IWebHostEnvironment env, IAntiforgery antiforgery)
        {
            //if (env.IsDevelopment())
            //{
            app.UseDeveloperExceptionPage();
            app.UseDatabaseErrorPage();
            app.UseSwaggerUi3(settings =>
            {
                settings.Path = "/api";
                settings.DocumentPath = "/api/specification.json";
            });
            //}
            //else
            //{
            //    app.UseExceptionHandler("/Error");
            //    // The default HSTS value is 30 days. You may want to change this for production scenarios, see https://aka.ms/aspnetcore-hsts.
            //    app.UseHsts();
            //}

            app.UseHealthChecks("/health");
            app.UseHttpsRedirection();
            app.UseStaticFiles();


            app.UseRouting();

            app.UseCors();

            app.UseBasicAuthentication();
            //app.UseJwtQueryAccessToken();
            app.UseAuthentication();
            app.UseAuthorization();
            app.UseEndpoints(endpoints =>
            {
                endpoints.MapControllerRoute(
                    "default",
                    "{controller}/{action=Index}/{id?}");
                endpoints.MapRazorPages();
            });
        }

    }
}