using ACG.SGLN.Lottery.Application.Common.Models;
using ACG.SGLN.Lottery.Domain.Common;
using ACG.SGLN.Lottery.WebUI.Common.Controllers.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Threading.Tasks;

namespace ACG.SGLN.Lottery.WebUI.Common.Controllers
{
    [Authorize]
    public abstract class BaseReadOnlyController<TEntity, TId> : BaseController<TEntity, TId>,
        IGetAction<TEntity, TId>,
        IGetByIdAction<TEntity, TId>
        where TEntity : BaseEntity<TId>
    {
        [HttpGet]
        public Task<ActionResult<PagedResult<TEntity>>> Get(int? page, int? size)
        {
            return DoGet(page, size);
        }

        [HttpGet("{id}")]
        public Task<ActionResult<TEntity>> GetById(TId id)
        {
            return DoGetById(id);
        }
    }
}