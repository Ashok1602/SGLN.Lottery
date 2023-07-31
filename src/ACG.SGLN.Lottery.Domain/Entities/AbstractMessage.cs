using ACG.SGLN.Lottery.Domain.Common;
using System;

namespace ACG.SGLN.Lottery.Domain.Entities
{
    public abstract class AbstractMessage : BaseEntity<Guid>
    {
        public string Title { get; set; }
        public string Body { get; set; }
        public Retailer TargetRetailer { get; set; }
        public Guid? TargetRetailerId { get; set; }
    }
}