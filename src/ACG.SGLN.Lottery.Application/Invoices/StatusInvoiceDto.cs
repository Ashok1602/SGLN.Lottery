using System.Collections.Generic;

namespace ACG.SGLN.Lottery.Application.Invoices
{
    public class StatusInvoiceDto
    {
        public double PaidAmountInvoicesLastSixMonths { get; set; }
        public double UnPaidAmountInvoicesLastSixMonths { get; set; }
        public List<MonthlyReportDto> MonthlyReport { get; set; }

    }
}