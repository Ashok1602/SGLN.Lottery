using ACG.SGLN.Lottery.Domain.Enums;
using System;

namespace ACG.SGLN.Lottery.Application
{
    public class DocumentDto
    {
        public string Id { get; set; }
        public DocumentType Type { get; set; }
        public DocumentSpec Spec { get; set; }
        public string MimeType { get; set; }
        public DateTime Created { get; set; }
        public string Comment { get; set; }
    }
}
