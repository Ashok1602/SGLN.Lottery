using ACG.SGLN.Lottery.Domain.Options;
using ACG.SGLN.Lottery.Infrastructure.Logger;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
using System.IO;
using System.Threading;

namespace ACG.SGLN.Lottery.Infrastructure.Services
{
    [ProviderAlias("FileLogger")]
    public class FileLoggerService : ILoggerProvider
    {
        public readonly FileLoggerOptions FileLoggerOptions;
        public SemaphoreSlim WriteFileLock;

        public FileLoggerService(IOptions<FileLoggerOptions> fileLoggerOptions)
        {
            WriteFileLock = new SemaphoreSlim(1, 1);
            FileLoggerOptions = fileLoggerOptions.Value;
            if (!Directory.Exists(FileLoggerOptions.FolderPath))
            {
                Directory.CreateDirectory(FileLoggerOptions.FolderPath);
            }
        }

        public ILogger CreateLogger(string categoryName)
        {
            return new FileLogger(this);
        }

        public void Dispose()
        {
        }

    }
}