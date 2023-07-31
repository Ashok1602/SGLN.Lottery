using ACG.SGLN.Lottery.Domain.Constants;
using ACG.SGLN.Lottery.Domain.Entities;
using ACG.SGLN.Lottery.Domain.Options;
using ACG.SGLN.Lottery.WebApi.Mobile.Converters;
using ACG.SGLN.Lottery.WebUI.Common.Converters;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Newtonsoft.Json;
using System.Collections.Generic;
using StartupBase = ACG.SGLN.Lottery.WebUI.Common.StartupBase;

namespace ACG.SGLN.Lottery.WebApi.Mobile
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
            services.Configure<PrintFooterOptions>(Configuration.GetSection(ConfigurationConstants.Sections.PrintFooterText));

            base.ConfigureServices(services);
        }
        /// <summary>
        /// 
        /// </summary>
        /// <returns></returns>
        protected override List<JsonConverter> GetConverters()
        {
            var converters = base.GetConverters();

            converters.Add(new DocumentDtoConverte());
            converters.Add(new DocumentConverter<TrainingDocument>());
            converters.Add(new TrainingQuestionOptionConverter());
            return converters;
        }


    }
}