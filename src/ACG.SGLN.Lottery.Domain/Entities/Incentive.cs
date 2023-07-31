using ACG.SGLN.Lottery.Domain.Common;
using ACG.SGLN.Lottery.Domain.Enums;
using System;

namespace ACG.SGLN.Lottery.Domain.Entities
{
    public class Incentive : BaseEntity<Guid>
    {
        public GameType Type { get; set; }
        public DateTime StartDate { get; set; }
        public DateTime EndDate { get; set; }
        public double Goal { get; set; }
        public double Achievement { get; set; }
        public double Bonus { get; set; }
        public Retailer Retailer { get; set; }
        public Guid RetailerId { get; set; }

    }
}
