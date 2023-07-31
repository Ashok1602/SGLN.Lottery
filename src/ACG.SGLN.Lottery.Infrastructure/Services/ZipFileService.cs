using ACG.SGLN.Lottery.Application.Common.Interfaces;
using System.IO;
using System.IO.Compression;
using System.Threading.Tasks;

namespace ACG.SGLN.Lottery.Infrastructure.Services
{
    public class ZipFileService : IZipFileService
    {

        public ZipFileService()
        {
        }

        public async Task<byte[]> GetFileContent(byte[] file, int fileIndex)
        {
            using (MemoryStream fs = new MemoryStream(file))
            using (ZipArchive zip = new ZipArchive(fs))
            {
                var stream = zip.Entries[fileIndex].Open();
                byte[] bytes = null;
                using (var ms = new MemoryStream())
                {
                    await stream.CopyToAsync(ms);
                    bytes = ms.ToArray();
                }
                return bytes;
            }
        }
    }
}