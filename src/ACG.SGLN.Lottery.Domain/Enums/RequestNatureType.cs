using System.ComponentModel;

namespace ACG.SGLN.Lottery.Domain.Enums
{
    public enum RequestNatureType
    {
        [Description("Techniques et Op�rations")]
        Technical,
        [Description("Administrative et financi�re")]
        Administration,
        [Description("Commerciales et Marketing")]
        Sales, // to fill with customer
    }
}