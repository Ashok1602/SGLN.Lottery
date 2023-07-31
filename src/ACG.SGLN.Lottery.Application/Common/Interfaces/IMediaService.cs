using System.IO;

namespace ACG.SGLN.Lottery.Application.Common.Interfaces
{
    public interface IMediaService
    {
        byte[] AddWatermarkToImage(byte[] imageData);
        Stream GetThumbnail(Stream stream);
    }
}