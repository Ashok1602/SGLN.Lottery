using ACG.SGLN.Lottery.Domain.Entities;
using System.Collections.Generic;

namespace ACG.SGLN.Lottery.Domain.Common
{
    public interface IHasDocuments<T> where T : AbstractDocument
    {
        List<T> Documents { get; set; }
    }
}
