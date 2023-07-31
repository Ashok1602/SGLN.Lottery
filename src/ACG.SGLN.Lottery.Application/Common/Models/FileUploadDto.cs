using ACG.SGLN.Lottery.Domain.Enums;

namespace ACG.SGLN.Lottery.Application.Common.Models
{
    /// <summary>
    /// 
    /// </summary>
    public class FileUploadDto
    {
        public DocumentType Type { get; set; }
        public byte[] File { get; set; }
        public string MimeType { get; set; }
        public string FileName { get; set; }
    }
}
