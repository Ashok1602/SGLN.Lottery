using ACG.SGLN.Lottery.Domain.Options;
using ACG.SGLN.Lottery.Infrastructure.Services;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;
using System;

namespace ACG.SGLN.Lottery.Infrastructure.Logger
{
    public static class FileLoggerExtensions
    {
        public static ILoggingBuilder AddFileLogger(this ILoggingBuilder builder, Action<FileLoggerOptions> configure)
        {
            builder.Services.AddSingleton<ILoggerProvider, FileLoggerService>();
            builder.Services.Configure(configure);
            return builder;
        }
    }
}
