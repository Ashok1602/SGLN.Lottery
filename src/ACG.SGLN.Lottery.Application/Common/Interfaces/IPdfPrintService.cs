using System.Threading.Tasks;

namespace ACG.SGLN.Lottery.Application.Common.Interfaces
{
    public interface IPdfPrintService
    {
        Task<byte[]> GeneratePdf<TModel>(string template, TModel model, bool isLandscape = false, bool isImageBased = false, bool useWkhtmltopdf = false);
        byte[] GenerateQRCode(string text);
    }
}
