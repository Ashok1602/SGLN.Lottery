using System.ComponentModel;

namespace ACG.SGLN.Lottery.Domain.Enums
{
    public enum ProcessingDirectionType
    {
        [Description("Direction Commerciale et Op�rations")]
        DCO,
        [Description("Direction Marketing et D�veloppement")]
        DMD,
        [Description("Direction Finances et Support")]
        DFS,
        [Description("Direction Contr�le Permanent et Risk Management")]
        DCPRM
    }
}