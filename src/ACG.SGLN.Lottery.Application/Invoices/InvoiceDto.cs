using System;

namespace ACG.SGLN.Lottery.Application.Invoices
{
    public class InvoiceDto
    {
        public string Reference { get; set; }
        public string Status { get; set; }
        public DateTime Date { get; set; }
        public double Amount { get; set; }
        //public Guid RetailerId { get; set; }

    }
}