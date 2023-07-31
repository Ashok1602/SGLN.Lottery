using System.Threading.Tasks;

namespace ACG.SGLN.Lottery.Application.Common.Interfaces
{
    public interface IZipFileService
    {
        Task<byte[]> GetFileContent(byte[] file, int fileIndex);
    }
}
