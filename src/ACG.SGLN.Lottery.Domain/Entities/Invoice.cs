using ACG.SGLN.Lottery.Domain.Common;
using ACG.SGLN.Lottery.Domain.Enums;
using System;

namespace ACG.SGLN.Lottery.Domain.Entities
{
    public class Invoice : BaseEntity<Guid>
    {
        public string Reference { get; set; }
        public InvoiceStatusType Status { get; set; }
        public DateTime Date { get; set; }
        public double Amount { get; set; }
        public Retailer Retailer { get; set; }
        public Guid RetailerId { get; set; }

    }
}
