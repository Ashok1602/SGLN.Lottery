using System;

namespace ACG.SGLN.Lottery.Application.Invoices
{
    public class MonthlyReportDto
    {
        public string Month { get; set; }
        public string Year { get; set; }
        public DateTime StartDate { get; set; }
        public DateTime EndDate { get; set; }
        public double Total { get; set; }
        public double Unpaid { get; set; }
    }
}