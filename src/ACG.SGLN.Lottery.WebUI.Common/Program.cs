using ACG.SGLN.Lottery.Infrastructure.Logger;
using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using System;
using System.IO;
using System.Threading.Tasks;

namespace ACG.SGLN.Lottery.WebUI.Common
{
    public abstract class ProgramBase<TStartup> where TStartup : StartupBase
    {
        protected virtual async Task RunAsync(string[] args)
        {
            var host = DoCreateHostBuilder(args).Build();

            //using (var scope = host.Services.CreateScope())
            //{
            //    var services = scope.ServiceProvider;
            //    var logger = scope.ServiceProvider.GetRequiredService<ILogger<ProgramBase<TStartup>>>();
            //    try
            //    {
            //        var context = services.GetRequiredService<ApplicationDbContext>();

            //        var environment = Environment.GetEnvironmentVariable("ASPNETCORE_ENVIRONMENT") ?? "Development";

            //        if (environment == "Development")
            //        {
            //            logger.LogDebug("Running Migration + Seeding database");

            //            await context.Database.MigrateAsync();
            //            await ApplicationDbContextSeed.SeedAll(services, context);
            //        }
            //    }
            //    catch (Exception ex)
            //    {
            //        logger.LogError(ex, "An error occurred while migrating or seeding the database.");

            //        throw;
            //    }
            //}

            await host.RunAsync();
        }

        protected virtual IHostBuilder DoCreateHostBuilder(string[] args)
        {
            var environment = Environment.GetEnvironmentVariable("ASPNETCORE_ENVIRONMENT") ?? "Development";

            return Host.CreateDefaultBuilder(args)
                .ConfigureAppConfiguration((hostingContext, config) =>
                {
                    var env = hostingContext.HostingEnvironment;
                    var commonDir = Path.Combine(env.ContentRootPath, "..", "ACG.SGLN.Lottery.WebUI.Common");

                    config.AddJsonFile(Path.Combine(commonDir, "appsettings-common.json"), true, true);
                    config.AddJsonFile(Path.Combine(commonDir, $"appsettings-common.{environment}.json"), true);
                    config.AddJsonFile("appsettings-common.json", true, true);
                    config.AddJsonFile($"appsettings-common.{environment}.json", true);
                    config.AddJsonFile("appsettings.json", false, true);
                    config.AddJsonFile($"appsettings.{environment}.json", true);
                    config.AddEnvironmentVariables();
                })
                .ConfigureWebHostDefaults(webBuilder => { webBuilder.UseStartup<TStartup>(); })
                .ConfigureLogging((context, logging) =>
                {
                    logging.AddFileLogger(options =>
                    {
                        context.Configuration.GetSection("Logging").GetSection("FileLogger").GetSection("FileLoggerOptions").Bind(options);
                    });
                });
        }
    }
}