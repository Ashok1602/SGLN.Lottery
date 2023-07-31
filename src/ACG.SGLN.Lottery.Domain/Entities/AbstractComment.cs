using ACG.SGLN.Lottery.Domain.Common;
using System;

namespace ACG.SGLN.Lottery.Domain.Entities
{
    public abstract class AbstractComment : BaseEntity<Guid>
    {
        public string Body { get; set; }
    }
}