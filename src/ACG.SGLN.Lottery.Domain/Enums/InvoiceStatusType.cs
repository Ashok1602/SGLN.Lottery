using System.ComponentModel;

namespace ACG.SGLN.Lottery.Domain.Enums
{
    public enum InvoiceStatusType
    {
        [Description("Payée")]
        Paid = 0,
        [Description("Impayée")]
        Unpaid
    }
}