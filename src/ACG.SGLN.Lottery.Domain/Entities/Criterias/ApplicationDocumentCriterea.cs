using ACG.SGLN.Lottery.Domain.Enums;
using System;

namespace ACG.SGLN.Lottery.Domain.Entities.Criterias
{
    public class ApplicationDocumentCriterea
    {
        public string Title { get; set; }
        public DocumentType? Type { get; set; }
        public DateTime? MinCreationDate { get; set; }
        public DateTime? MaxCreationDate { get; set; }
    }
}