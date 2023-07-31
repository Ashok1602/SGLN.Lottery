using ACG.SGLN.Lottery.Domain.Entities;
using System.Collections.Generic;

namespace ACG.SGLN.Lottery.Domain.Common
{
    public interface IHasComments<T> where T : AbstractComment
    {
        List<T> Comments { get; set; }
    }
}
