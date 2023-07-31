using CsvHelper.Configuration.Attributes;

namespace ACG.SGLN.Lottery.Application.Invoices
{
    public class InvoiceInputDto
    {
        [Name("id")]
        public string InternalRetailerCode { get; set; }
        [Name("Reference")]
        public string Reference { get; set; }
        [Name("Stats")]
        public string Status { get; set; }
        [Name("Date")]
        public string Date { get; set; }
        [Name("Somme")]
        public double Amount { get; set; }
    }
}