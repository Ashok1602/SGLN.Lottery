using ACG.SGLN.Lottery.Application.Common.Models;
using ACG.SGLN.Lottery.Domain.Common;
using Microsoft.AspNetCore.Mvc;
using System.Threading.Tasks;

namespace ACG.SGLN.Lottery.WebUI.Common.Controllers.Interfaces
{
    public interface IGetAction<TEntity, TId>
        where TEntity : BaseEntity<TId>
    {
        Task<ActionResult<PagedResult<TEntity>>> Get(int? page, int? size);
    }
}