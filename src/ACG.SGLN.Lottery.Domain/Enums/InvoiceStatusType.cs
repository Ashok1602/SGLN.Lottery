using System.ComponentModel;

namespace ACG.SGLN.Lottery.Domain.Enums
{
    public enum InvoiceStatusType
    {
        [Description("Pay�e")]
        Paid = 0,
        [Description("Impay�e")]
        Unpaid
    }
}