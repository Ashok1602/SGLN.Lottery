using ACG.SGLN.Lottery.Domain.Common;
using Microsoft.AspNetCore.Mvc;
using System.Threading.Tasks;

namespace ACG.SGLN.Lottery.WebUI.Common.Controllers.Interfaces
{
    public interface IGetByIdAction<TEntity, TId>
        where TEntity : BaseEntity<TId>
    {
        Task<ActionResult<TEntity>> GetById(TId id);
    }
}