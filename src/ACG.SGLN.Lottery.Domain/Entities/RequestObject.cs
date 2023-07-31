using ACG.SGLN.Lottery.Domain.Enums;
using System;

namespace ACG.SGLN.Lottery.Domain.Entities
{
    public class RequestObject : AbstractDocument
    {
        public string Title { get; set; }
        public bool? IsExternal { get; set; } = false;
        public bool IsDeactivated { get; set; }
        public RequestCategory RequestCategory { get; set; }
        public Guid RequestCategoryId { get; set; }
        public ProcessingDirectionType? ProcessingDirection { get; set; }

    }
}
