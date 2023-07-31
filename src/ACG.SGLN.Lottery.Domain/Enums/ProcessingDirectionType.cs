using System.ComponentModel;

namespace ACG.SGLN.Lottery.Domain.Enums
{
    public enum ProcessingDirectionType
    {
        [Description("Direction Commerciale et Opérations")]
        DCO,
        [Description("Direction Marketing et Développement")]
        DMD,
        [Description("Direction Finances et Support")]
        DFS,
        [Description("Direction Contrôle Permanent et Risk Management")]
        DCPRM
    }
}