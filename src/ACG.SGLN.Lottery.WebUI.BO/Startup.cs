using ACG.SGLN.Lottery.Domain.Constants;
using ACG.SGLN.Lottery.Domain.Options;
using ACG.SGLN.Lottery.WebUI.BO.Converters;
using ACG.SGLN.Lottery.WebUI.Common;
using ACG.SGLN.Lottery.WebUI.Common.Services;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;

namespace ACG.SGLN.Lottery.WebUI.BO
{
    /// <summary>
    /// 
    /// </summary>
    public class Startup : StartupBase
    {
        /// <summary>
        /// 
        /// </summary>
        /// <param name="configuration"></param>
        public Startup(IConfiguration configuration) : base(configuration)
        {
        }

        /// <summary>
        /// 
        /// </summary>
        /// <param name="services"></param>
        public override void ConfigureServices(IServiceCollection services)
        {
            services.Configure<PrintFooterOptions>(
                Configuration.GetSection(ConfigurationConstants.Sections.PrintFooterText));
            services.Configure<UrlsOptions>(
                Configuration.GetSection(ConfigurationConstants.Sections.Urls));
            services.Configure<FTPOptions>(
                Configuration.GetSection(ConfigurationConstants.Sections.Ftp));

            services.AddScoped<IScopedProcessingService, IncentivesCronJob>();
            services.AddScoped<IScopedProcessingService, InvoicesCronJob>();

            services.AddCronJob<CronJobConsumeService>(c =>
            {
                c.TimeZoneInfo = TimeZoneInfo.Local;
                //c.CronExpression = @"* * * * *"; //avery minute 
                c.CronExpression = @"0 0 * * *"; //once a day at midnight
            });


            base.ConfigureServices(services);
        }

        /// <summary>
        /// 
        /// </summary>
        /// <returns></returns>
        protected override List<JsonConverter> GetConverters()
        {
            var converters = base.GetConverters();
            converters.Add(new TrainingDocumentsConverter());
            //converters.Add(new TestConverter());
            return converters;
        }
    }
}