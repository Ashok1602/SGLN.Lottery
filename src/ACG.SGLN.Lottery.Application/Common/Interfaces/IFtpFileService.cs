using System.Threading.Tasks;

namespace ACG.SGLN.Lottery.Application.Common.Interfaces
{
    public interface IFtpFileService
    {
        Task<byte[]> GetFtpFileAsync(string path);
    }
}
