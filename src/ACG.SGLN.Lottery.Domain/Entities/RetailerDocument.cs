using System;

namespace ACG.SGLN.Lottery.Domain.Entities
{
    public class RetailerDocument : AbstractDocument
    {
        public Retailer Retailer { get; set; }
        public Guid RetailerId { get; set; }
        public string Title { get; set; }

    }
}
