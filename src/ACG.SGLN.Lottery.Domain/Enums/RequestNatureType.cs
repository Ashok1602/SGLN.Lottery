using System.ComponentModel;

namespace ACG.SGLN.Lottery.Domain.Enums
{
    public enum RequestNatureType
    {
        [Description("Techniques et Opérations")]
        Technical,
        [Description("Administrative et financiére")]
        Administration,
        [Description("Commerciales et Marketing")]
        Sales, // to fill with customer
    }
}