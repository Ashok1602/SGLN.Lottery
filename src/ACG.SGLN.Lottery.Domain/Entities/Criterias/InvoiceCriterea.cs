using System;

namespace ACG.SGLN.Lottery.Domain.Entities.Criterias
{
    public class InvoiceCriterea
    {
        public DateTime? StartDate { get; set; }
        public DateTime? EndDate { get; set; }
        public double? MinAmount { get; set; }
        public double? MaxAmount { get; set; }
        public Guid? RetailerId { get; set; }
    }
}