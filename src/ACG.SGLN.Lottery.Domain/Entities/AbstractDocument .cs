using ACG.SGLN.Lottery.Domain.Common;
using ACG.SGLN.Lottery.Domain.Enums;
using System;

namespace ACG.SGLN.Lottery.Domain.Entities
{
    public abstract class AbstractDocument : BaseEntity<Guid>
    {
        public string Uri { get; set; }
        public byte[] Data { get; set; }
        public string MimeType { get; set; }
        public bool? IsGenerated { get; set; }

        public DocumentType Type { get; set; }
        public DocumentSpec Spec { get; set; } = DocumentSpec.None;
        public string Comment { get; set; }
    }
}