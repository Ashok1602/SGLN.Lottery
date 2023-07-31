using ACG.SGLN.Lottery.Application.Common.Interfaces;
using ACG.SGLN.Lottery.Domain.Options;
using Microsoft.Extensions.Options;
using System.Net;
using System.Threading.Tasks;

namespace ACG.SGLN.Lottery.Infrastructure.Services
{
    public class FtpFileService : IFtpFileService
    {
        private readonly FTPOptions _ftpOptions;

        public FtpFileService(IOptions<FTPOptions> ftpOptions)
        {
            _ftpOptions = ftpOptions.Value;
        }

        public async Task<byte[]> GetFtpFileAsync(string path)
        {
            string ftpfullpath = "ftp://" + _ftpOptions.Host + path;

            WebClient request = new WebClient();

            request.Credentials = new NetworkCredential(_ftpOptions.UserName, _ftpOptions.Password);
            byte[] fileData = await request.DownloadDataTaskAsync(ftpfullpath);

            request.Dispose();

            return fileData;
        }
    }
}